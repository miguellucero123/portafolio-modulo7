/**
 * WeatherApp - Clase principal de la aplicación meteorológica
 * Gestiona lugares, peticiones a la API, actualización de la interfaz y estadísticas
 * Utiliza programación orientada a objetos y ES6+
 */
class WeatherApp {
    /**
     * Constructor de WeatherApp
     * @param {ApiClient} apiClient - Instancia del cliente API
     */
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.lugares = [];
        this.datosClima = {};
        this.estadisticasCalculator = new EstadisticasCalculator();
        this.weatherAlerts = new WeatherAlerts({
            umbralCalor: 25,
            umbralDiasLluvia: 4,
            umbralViento: 60,
            umbralFrio: -5
        });
        // Generador de alertas con LLM (solo para Torres del Paine)
        this.llmAlertGenerator = typeof LLMAlertGenerator !== 'undefined' 
            ? new LLMAlertGenerator({
                useLLM: false, // Por defecto deshabilitado (requiere API key)
                fallbackToRules: true
            })
            : null;
        // Generador de alertas por día y sector para circuitos W y O
        this.circuitAlertGenerator = typeof CircuitAlertGenerator !== 'undefined'
            ? new CircuitAlertGenerator(apiClient)
            : null;
        this.lastUpdate = null;
    }

    /**
     * Carga los lugares iniciales de la configuración
     * @param {Array<Object>} configCiudades - Array de ciudades con coordenadas
     */
    cargarLugares(configCiudades = []) {
        this.lugares = configCiudades.map(ciudad => ({
            nombre: ciudad.nombre,
            coords: ciudad.coords,
            distancia: ciudad.coords.distance || 0
        }));
    }

    /**
     * Carga datos de clima para todos los lugares desde la API
     * Utiliza peticiones secuenciales con delay para evitar rate limiting
     * @param {Object} options - Opciones para la carga {includeHourly, includeModels, pastDays}
     * @returns {Promise<void>}
     */
    async cargarDatosClima(options = {}) {
        try {
            console.log('🌐 Cargando datos meteorológicos desde la API...');
            
            // Opciones por defecto: hourly habilitado, models deshabilitado, pastDays = 0 (no histórico para daily)
            const { 
                includeHourly = true, 
                includeModels = false, 
                pastDays = 0 // Cambiado a 0 para no mezclar histórico con pronóstico
            } = options;
            
            // Función helper para esperar un tiempo
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            
            // Cargar datos de forma secuencial con delay para evitar rate limiting
            for (const lugar of this.lugares) {
                try {
                    const datos = await this.apiClient.obtenerDatosClima(
                        lugar.nombre, 
                        lugar.coords,
                        { includeHourly, includeModels, pastDays }
                    );
                    if (datos) {
                        this.datosClima[lugar.nombre] = datos;
                    }
                    
                    // Delay de 500ms entre peticiones para evitar 429 (Too Many Requests)
                    // La API de Open-Meteo permite hasta 10000 peticiones/día, pero limita por minuto
                    await delay(500);
                    
                } catch (error) {
                    console.error(`Error cargando ${lugar.nombre}:`, error);
                    // Continuar con la siguiente ciudad aunque esta falle
                }
            }

            this.lastUpdate = new Date();

            console.log(`✅ Datos cargados para ${Object.keys(this.datosClima).length} lugares`);
            
            // Disparar evento personalizado
            this._dispararEventoActualizacion();

        } catch (error) {
            console.error('❌ Error cargando datos climáticos:', error);
            throw error;
        }
    }

    /**
     * Carga el detalle de un lugar específico con opciones avanzadas
     * @param {string} nombreLugar - Nombre del lugar
     * @param {Object} options - Opciones {includeHourly, includeModels, pastDays}
     * @returns {Promise<Object|null>} Datos del lugar o null
     */
    async cargarDetalleLugar(nombreLugar, options = {}) {
        const lugar = this.lugares.find(l => l.nombre === nombreLugar);
        if (!lugar) {
            console.warn(`Lugar no encontrado: ${nombreLugar}`);
            return null;
        }

        // Opciones por defecto para detalle (incluir hourly, opcionalmente models)
        const { 
            includeHourly = true, 
            includeModels = false, 
            pastDays = 5 
        } = options;

        // Si ya tenemos los datos con las mismas opciones, retornarlos
        if (this.datosClima[nombreLugar]) {
            return this.datosClima[nombreLugar];
        }

        // Si no, cargar desde la API
        try {
            const datos = await this.apiClient.obtenerDatosClima(
                lugar.nombre, 
                lugar.coords,
                { includeHourly, includeModels, pastDays }
            );
            if (datos) {
                this.datosClima[nombreLugar] = datos;
            }
            return datos;
        } catch (error) {
            console.error(`Error cargando detalle de ${nombreLugar}:`, error);
            return null;
        }
    }

    /**
     * Calcula estadísticas para un lugar específico
     * @param {string} nombreLugar - Nombre del lugar
     * @returns {Object|null} Estadísticas calculadas o null
     */
    calcularEstadisticas(nombreLugar) {
        const datos = this.datosClima[nombreLugar];
        if (!datos || !datos.daily) {
            return null;
        }

        const estadisticas = this.estadisticasCalculator.calcularEstadisticas(datos.daily);
        
        if (estadisticas) {
            estadisticas.resumen = this.estadisticasCalculator.generarResumen(estadisticas);
        }

        return estadisticas;
    }

    /**
     * Obtiene alertas meteorológicas para un lugar
     * Solo genera alertas para Torres del Paine usando LLM
     * @param {string} nombreLugar - Nombre del lugar
     * @returns {Promise<Array<Object>>} Array de alertas generadas
     */
    async obtenerAlertas(nombreLugar) {
        // Solo generar alertas para Torres del Paine
        const torresDelPaine = 'Torres del Paine - Glaciar Grey';
        if (nombreLugar !== torresDelPaine) {
            return [];
        }

        const datos = this.datosClima[nombreLugar];
        if (!datos) {
            return [];
        }

        const estadisticas = this.calcularEstadisticas(nombreLugar);
        if (!estadisticas) {
            return [];
        }

        // Usar LLM si está disponible, sino usar reglas mejoradas
        if (this.llmAlertGenerator) {
            try {
                const alertas = await this.llmAlertGenerator.generarAlertasInteligentes(
                    estadisticas,
                    datos.daily,
                    datos.current
                );
                return alertas;
            } catch (error) {
                console.warn('Error generando alertas con LLM, usando reglas locales:', error);
                return this.llmAlertGenerator.generarAlertasInteligentesLocal(
                    estadisticas,
                    datos.daily,
                    datos.current
                );
            }
        }

        // Fallback a reglas simples mejoradas
        return this.weatherAlerts.generarAlertas(estadisticas, datos.daily);
    }

    /**
     * Obtiene todos los lugares disponibles
     * @returns {Array<string>} Array de nombres de lugares
     */
    obtenerTodosLosLugares() {
        return this.lugares.map(lugar => lugar.nombre);
    }

    /**
     * Genera alertas por día y por sector para circuitos W y O
     * @returns {Promise<Array<Object>>} Array de alertas organizadas por día y sector
     */
    async obtenerAlertasPorDiaYLugar() {
        if (!this.circuitAlertGenerator) {
            return [];
        }
        return await this.circuitAlertGenerator.generarAlertasPorDiaYLugar();
    }

    /**
     * Obtiene datos de clima para un lugar específico
     * @param {string} nombreLugar - Nombre del lugar
     * @returns {Object|null} Datos de clima o null
     */
    obtenerDatosClima(nombreLugar) {
        return this.datosClima[nombreLugar] || null;
    }

    /**
     * Obtiene la última fecha de actualización
     * @returns {Date|null} Fecha de última actualización o null
     */
    obtenerUltimaActualizacion() {
        return this.lastUpdate;
    }

    /**
     * Actualiza manualmente los datos desde la API
     * @param {Object} options - Opciones para la actualización
     * @returns {Promise<void>}
     */
    async actualizarDatos(options = {}) {
        console.log('🔄 Actualizando datos meteorológicos (forzando actualización)...');
        
        // Forzar actualización usando forceRefresh en lugar de limpiar todo el caché
        const optionsWithForce = { ...options, forceRefresh: true };
        
        // Actualizar cada lugar forzando refresh
        for (const lugar of this.lugares) {
            try {
                const datos = await this.apiClient.obtenerDatosClima(
                    lugar.nombre, 
                    lugar.coords,
                    { 
                        includeHourly: options.includeHourly !== false,
                        includeModels: options.includeModels || false,
                        pastDays: options.pastDays || 5,
                        forceRefresh: true
                    }
                );
                if (datos) {
                    this.datosClima[lugar.nombre] = datos;
                }
                // Delay de 500ms entre peticiones para evitar rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error actualizando ${lugar.nombre}:`, error);
            }
        }
        
        this.lastUpdate = new Date();
        console.log(`✅ Datos actualizados - Última actualización: ${this.lastUpdate.toLocaleString('es-CL')}`);
        
        // Disparar evento personalizado
        this._dispararEventoActualizacion();
    }

    /**
     * Dispara evento personalizado cuando los datos se actualizan
     * @private
     */
    _dispararEventoActualizacion() {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('weatherUpdated', {
                detail: {
                    timestamp: this.lastUpdate,
                    lugares: this.obtenerTodosLosLugares()
                }
            }));
        }
    }

    /**
     * Obtiene datos horarios para un lugar específico
     * @param {string} nombreLugar - Nombre del lugar
     * @param {Date} fechaInicio - Fecha de inicio (opcional)
     * @param {Date} fechaFin - Fecha de fin (opcional)
     * @returns {Array<Object>} Array de datos horarios
     */
    obtenerDatosHorarios(nombreLugar, fechaInicio = null, fechaFin = null) {
        const datos = this.datosClima[nombreLugar];
        if (!datos) {
            return [];
        }
        return this.apiClient.obtenerDatosHorarios(datos, fechaInicio, fechaFin);
    }

    /**
     * Compara múltiples modelos meteorológicos para un lugar
     * @param {string} nombreLugar - Nombre del lugar
     * @returns {Object|null} Comparación de modelos o null
     */
    compararModelosMeteorologicos(nombreLugar) {
        const datos = this.datosClima[nombreLugar];
        if (!datos) {
            return null;
        }
        return this.apiClient.compararModelos(datos);
    }

    /**
     * Obtiene descripción del clima a partir del código WMO
     * @param {number} code - Código meteorológico WMO
     * @returns {string} Descripción del clima
     */
    obtenerDescripcionClima(code) {
        const descripciones = {
            0: 'Despejado',
            1: 'Mayormente despejado',
            2: 'Parcialmente nublado',
            3: 'Nublado',
            45: 'Niebla',
            48: 'Niebla con escarcha',
            51: 'Llovizna ligera',
            53: 'Llovizna moderada',
            55: 'Llovizna densa',
            61: 'Lluvia ligera',
            63: 'Lluvia moderada',
            65: 'Lluvia densa',
            71: 'Nieve ligera',
            73: 'Nieve moderada',
            75: 'Nieve densa',
            77: 'Granos de nieve',
            80: 'Chubascos ligeros',
            81: 'Chubascos moderados',
            82: 'Chubascos violentos',
            85: 'Chubascos de nieve ligeros',
            86: 'Chubascos de nieve fuertes',
            95: 'Tormenta',
            96: 'Tormenta con granizo ligero',
            99: 'Tormenta con granizo fuerte'
        };
        return descripciones[code] || 'Desconocido';
    }

    /**
     * Obtiene icono de Font Awesome a partir del código WMO
     * @param {number} code - Código meteorológico WMO
     * @returns {string} Clase de icono
     */
    obtenerIconoClima(code) {
        if (code === 0 || code === 1) return 'fa-sun';
        if (code === 2 || code === 3) return 'fa-cloud-sun';
        if (code >= 45 && code <= 48) return 'fa-smog';
        if (code >= 51 && code <= 67) return 'fa-cloud-rain';
        if (code >= 71 && code <= 77) return 'fa-snowflake';
        if (code >= 80 && code <= 82) return 'fa-cloud-showers-heavy';
        if (code >= 85 && code <= 86) return 'fa-snowflake';
        if (code >= 95) return 'fa-bolt';
        return 'fa-cloud';
    }

    /**
     * Obtiene modificador BEM a partir del código WMO
     * @param {number} code - Código meteorológico WMO
     * @returns {string} Modificador BEM
     */
    obtenerModificadorClima(code) {
        if (code === 0 || code === 1) return 'sunny';
        if (code === 2 || code === 3) return 'cloudy';
        if (code >= 51 && code <= 67) return 'rainy';
        if (code >= 71 && code <= 86) return 'snowy';
        return 'cloudy';
    }

    /**
     * Obtiene dirección del viento a partir de grados
     * @param {number} degrees - Grados de dirección del viento
     * @returns {string} Dirección del viento (N, NE, E, SE, S, SO, O, NO)
     */
    obtenerDireccionViento(degrees) {
        const direcciones = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
        const indice = Math.round(degrees / 45) % 8;
        return direcciones[indice];
    }

    /**
     * Calcula el nivel de congelación (isoterma cero) en metros
     * Usa la tasa de lapso atmosférico estándar: -6.5°C por 1000m
     * @param {number} tempAtSeaLevel - Temperatura al nivel del mar en °C
     * @param {number} baseAltitude - Altitud base en metros (por defecto 0)
     * @returns {number} Altura de la isoterma 0°C en metros
     */
    calcularNivelCongelacion(tempAtSeaLevel, baseAltitude = 0) {
        const tasaLapso = 6.5; // °C por 1000m

        // Si la temperatura ya está bajo 0°C en la base, el nivel de congelación está en o por debajo de la base
        if (tempAtSeaLevel <= 0) {
            return baseAltitude;
        }

        // Calcular altura donde la temperatura alcanza 0°C
        const alturaSobreBase = (tempAtSeaLevel / tasaLapso) * 1000;
        return Math.round(baseAltitude + alturaSobreBase);
    }

    /**
     * Obtiene nivel de severidad del viento frío
     * @param {number} temperaturaAparente - Temperatura aparente (sensación térmica)
     * @param {number} temperaturaActual - Temperatura actual
     * @returns {Object} Información de severidad
     */
    obtenerSeveridadVientoFrio(temperaturaAparente, temperaturaActual) {
        const diferencia = temperaturaActual - temperaturaAparente;

        if (temperaturaAparente <= -20) {
            return {
                nivel: 'extremo',
                color: '#8b0000',
                icono: 'fa-skull-crossbones',
                mensaje: 'PELIGRO EXTREMO - Congelación en minutos',
                clase: 'danger'
            };
        } else if (temperaturaAparente <= -10) {
            return {
                nivel: 'severo',
                color: '#dc3545',
                icono: 'fa-exclamation-triangle',
                mensaje: 'Peligro Alto - Riesgo de hipotermia',
                clase: 'danger'
            };
        } else if (temperaturaAparente <= 0 || diferencia > 10) {
            return {
                nivel: 'moderado',
                color: '#ffc107',
                icono: 'fa-exclamation-circle',
                mensaje: 'Precaución - Viento frío significativo',
                clase: 'warning'
            };
        } else if (diferencia > 5) {
            return {
                nivel: 'bajo',
                color: '#17a2b8',
                icono: 'fa-info-circle',
                mensaje: 'Sensación de frío por viento',
                clase: 'info'
            };
        } else {
            return {
                nivel: 'ninguno',
                color: '#28a745',
                icono: 'fa-check-circle',
                mensaje: 'Condiciones normales',
                clase: 'success'
            };
        }
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.WeatherApp = WeatherApp;
}
