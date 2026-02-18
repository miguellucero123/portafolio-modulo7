/**
 * ApiClient - Clase para gestionar las peticiones a la API Open-Meteo
 * Encapsula toda la lógica de comunicación con la API externa
 * Utiliza Fetch API y async/await para programación asíncrona
 */
class ApiClient {
    /**
     * Constructor de ApiClient
     * @param {string} baseUrl - URL base de la API (por defecto Open-Meteo)
     */
    constructor(baseUrl = 'https://api.open-meteo.com/v1/forecast') {
        this.baseUrl = baseUrl;
        this.cache = new Map();
        this.cacheTimeout = 1 * 60 * 60 * 1000; // 1 hora en milisegundos (reducido para datos más actuales)
    }

    /**
     * Obtiene datos meteorológicos para una ciudad
     * Incluye datos horarios, múltiples modelos y datos históricos
     * @param {string} cityName - Nombre de la ciudad
     * @param {Object} coords - Coordenadas {lat, lon}
     * @param {Object} options - Opciones adicionales {includeHourly, includeModels, pastDays}
     * @returns {Promise<Object>} Datos meteorológicos transformados
     */
    async obtenerDatosClima(cityName, coords, options = {}) {
        const { lat, lon } = coords;
        const {
            includeHourly = true,
            includeModels = false,
            pastDays = 5,
            forceRefresh = false, // Nueva opción para forzar actualización
            model = null // Modelo específico: 'ecmwf_ifs025', 'gfs_graphcast025', 'icon_global'
        } = options;

        // Verificar caché primero (solo si no se fuerza actualización)
        const cacheKey = `${cityName}_${lat}_${lon}_${includeHourly}_${includeModels}_${model || 'default'}_${pastDays}`;
        if (!forceRefresh) {
            const cached = this.obtenerDeCache(cacheKey);
            if (cached) {
                const edadMinutos = Math.round((Date.now() - (this.cache.get(cacheKey)?.timestamp || 0)) / 60000);
                console.log(`✓ Usando datos en caché para ${cityName} (actualizados hace ${edadMinutos} minutos)`);
                return cached;
            }
        } else {
            // Limpiar caché específico si se fuerza actualización
            this.cache.delete(cacheKey);
            console.log(`🔄 Forzando actualización de datos para ${cityName}`);
        }

        // Construir parámetros de la petición base
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max',
            timezone: 'America/Santiago',
            forecast_days: 7
        });

        // Agregar datos horarios si está habilitado
        if (includeHourly) {
            params.append('hourly', 'temperature_2m,precipitation_probability,snowfall,pressure_msl,wind_speed_10m,wind_gusts_10m,precipitation,cloud_cover_low,cloud_cover_mid,cloud_cover_high,weather_code');
        }

        // Agregar modelo específico si se especifica, o múltiples modelos si includeModels es true
        if (model) {
            // Modelo específico seleccionado
            params.append('models', model);
            console.log(`📊 Usando modelo específico: ${model}`);
        } else if (includeModels) {
            // Múltiples modelos (para comparación)
            params.append('models', 'ecmwf_ifs025,gfs_graphcast025,icon_global');
        }

        // Agregar datos históricos solo para datos horarios (no para daily que usamos para pronóstico)
        // No incluir past_days en daily para evitar confusión entre histórico y pronóstico
        // Si necesitamos histórico, lo pediremos solo para hourly

        // Agregar timestamp para evitar caché del navegador
        const timestamp = Date.now();
        const url = `${this.baseUrl}?${params}&_t=${timestamp}`;

        console.log(`🌐 Consultando API para ${cityName}...`);
        try {
            let response = await fetch(url, {
                cache: 'no-store', // No almacenar en caché del navegador
                headers: {
                    'Accept': 'application/json'
                }
            });

            // Manejo especial para rate limiting (429)
            if (response.status === 429) {
                console.warn(`⚠️ Rate limit alcanzado para ${cityName}. Esperando 2 segundos antes de reintentar...`);
                // Esperar 2 segundos antes de reintentar una vez
                await new Promise(resolve => setTimeout(resolve, 2000));
                response = await fetch(url);
                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error(`Error HTTP: ${response.status} - Rate limit persistente. Por favor espera unos minutos.`);
                    } else {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                }
            } else if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            // Obtener los datos de la respuesta
            const data = await response.json();

            // Validar que la respuesta tenga datos
            if (!data || !data.current || !data.daily) {
                throw new Error(`Respuesta incompleta de la API para ${cityName}`);
            }

            console.log(`✓ Respuesta API recibida para ${cityName}:`, {
                current: !!data.current,
                daily: !!data.daily,
                dailyTimeLength: data.daily?.time?.length || 0,
                hourlyLength: data.hourly?.time?.length || 0,
                currentTemp: data.current?.temperature_2m,
                currentWeatherCode: data.current?.weather_code,
                currentWindSpeed: data.current?.wind_speed_10m,
                firstDailyTime: data.daily?.time?.[0],
                firstDailyTempMax: data.daily?.temperature_2m_max?.[0],
                firstDailyTempMin: data.daily?.temperature_2m_min?.[0]
            });

            // Filtrar datos diarios para mostrar solo pronóstico futuro (no histórico)
            const ahora = new Date();
            ahora.setHours(0, 0, 0, 0); // Inicio del día actual

            const timeArray = data.daily.time || [];
            const indicesFuturos = [];
            const pronosticoFuturo = {
                time: [],
                weather_code: [],
                temperature_2m_max: [],
                temperature_2m_min: [],
                apparent_temperature_max: [],
                apparent_temperature_min: [],
                precipitation_sum: [],
                showers_sum: [],
                snowfall_sum: [],
                precipitation_probability_max: [],
                wind_speed_10m_max: []
            };

            // Filtrar solo días futuros (pronóstico)
            timeArray.forEach((fechaStr, index) => {
                const fecha = new Date(fechaStr);
                fecha.setHours(0, 0, 0, 0);

                // Incluir solo días futuros (mañana en adelante)
                if (fecha > ahora) {
                    pronosticoFuturo.time.push(fechaStr);
                    if (data.daily.weather_code) pronosticoFuturo.weather_code.push(data.daily.weather_code[index]);
                    if (data.daily.temperature_2m_max) pronosticoFuturo.temperature_2m_max.push(data.daily.temperature_2m_max[index]);
                    if (data.daily.temperature_2m_min) pronosticoFuturo.temperature_2m_min.push(data.daily.temperature_2m_min[index]);
                    if (data.daily.apparent_temperature_max) pronosticoFuturo.apparent_temperature_max.push(data.daily.apparent_temperature_max[index]);
                    if (data.daily.apparent_temperature_min) pronosticoFuturo.apparent_temperature_min.push(data.daily.apparent_temperature_min[index]);
                    if (data.daily.precipitation_sum) pronosticoFuturo.precipitation_sum.push(data.daily.precipitation_sum[index]);
                    if (data.daily.showers_sum) pronosticoFuturo.showers_sum.push(data.daily.showers_sum[index]);
                    if (data.daily.snowfall_sum) pronosticoFuturo.snowfall_sum.push(data.daily.snowfall_sum[index]);
                    if (data.daily.precipitation_probability_max) pronosticoFuturo.precipitation_probability_max.push(data.daily.precipitation_probability_max[index]);
                    if (data.daily.wind_speed_10m_max) pronosticoFuturo.wind_speed_10m_max.push(data.daily.wind_speed_10m_max[index]);
                }
            });

            // Transformar respuesta de API al formato interno
            const datosTransformados = {
                city: {
                    name: cityName,
                    lat: lat,
                    lon: lon,
                    distance: coords.distance || 0,
                    zone: coords.zone || ''
                },
                current: {
                    time: data.current.time,
                    temperature_2m: data.current.temperature_2m,
                    weather_code: data.current.weather_code,
                    wind_speed_10m: data.current.wind_speed_10m,
                    wind_direction_10m: data.current.wind_direction_10m,
                    relative_humidity_2m: data.current.relative_humidity_2m
                },
                daily: pronosticoFuturo, // Solo datos futuros
                updated: new Date().toISOString(),
                fetchedAt: new Date().toISOString(), // Timestamp de cuándo se obtuvieron
                timestamp: Date.now() // Timestamp numérico para comparaciones
            };

            console.log(`✓ Datos filtrados: ${pronosticoFuturo.time.length} días de pronóstico futuro para ${cityName}`);

            // Procesar datos horarios si están disponibles
            if (includeHourly && data.hourly) {
                datosTransformados.hourly = {
                    time: data.hourly.time,
                    temperature_2m: data.hourly.temperature_2m,
                    precipitation_probability: data.hourly.precipitation_probability,
                    snowfall: data.hourly.snowfall,
                    pressure_msl: data.hourly.pressure_msl,
                    wind_speed_10m: data.hourly.wind_speed_10m,
                    wind_gusts_10m: data.hourly.wind_gusts_10m,
                    precipitation: data.hourly.precipitation,
                    cloud_cover_low: data.hourly.cloud_cover_low,
                    cloud_cover_mid: data.hourly.cloud_cover_mid,
                    cloud_cover_high: data.hourly.cloud_cover_high,
                    weather_code: data.hourly.weather_code
                };
            }

            // Procesar múltiples modelos si están disponibles
            if (includeModels && Array.isArray(data)) {
                datosTransformados.models = data.map((modelData, index) => ({
                    model: this._obtenerNombreModelo(index),
                    latitude: modelData.latitude,
                    longitude: modelData.longitude,
                    elevation: modelData.elevation,
                    utcOffsetSeconds: modelData.utc_offset_seconds,
                    current: modelData.current,
                    daily: modelData.daily,
                    hourly: modelData.hourly
                }));
            }

            // Guardar en caché
            this.guardarEnCache(cacheKey, datosTransformados);

            const fechaActualizacion = new Date(datosTransformados.fetchedAt).toLocaleString('es-CL');
            console.log(`✓ Datos obtenidos para ${cityName} - Actualizado: ${fechaActualizacion}`);
            console.log(`   📍 Coordenadas: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
            console.log(`   🌡️ Temperatura actual: ${datosTransformados.current.temperature_2m.toFixed(1)}°C (redondeado: ${Math.round(datosTransformados.current.temperature_2m)}°C)`);
            console.log(`   💨 Viento: ${datosTransformados.current.wind_speed_10m.toFixed(1)} km/h (redondeado: ${Math.round(datosTransformados.current.wind_speed_10m)} km/h)`);
            console.log(`   🌧️ Humedad: ${datosTransformados.current.relative_humidity_2m}%`);
            console.log(`   🌤️ Código climático: ${datosTransformados.current.weather_code}`);
            console.log(`   📅 Pronóstico: ${pronosticoFuturo.time.length} días futuros`);
            if (datosTransformados.hourly && datosTransformados.hourly.time && datosTransformados.hourly.time.length > 0) {
                console.log(`   ⏰ Datos horarios: ${datosTransformados.hourly.time.length} horas`);
                console.log(`   ⏰ Primera hora: ${datosTransformados.hourly.time[0]}`);
                if (datosTransformados.hourly.temperature_2m && datosTransformados.hourly.temperature_2m[0] !== undefined) {
                    console.log(`   ⏰ Temp primera hora: ${datosTransformados.hourly.temperature_2m[0].toFixed(1)}°C`);
                }
            }
            return datosTransformados;

        } catch (error) {
            console.error(`✗ Error obteniendo datos para ${cityName}:`, error);
            throw error;
        }
    }

    /**
     * Obtiene datos para múltiples ciudades en paralelo
     * @param {Array<Object>} ciudades - Array de objetos {name, coords}
     * @returns {Promise<Array>} Array de datos meteorológicos
     */
    async obtenerDatosMultiples(ciudades = []) {
        const promesas = ciudades.map(({ name, coords }) =>
            this.obtenerDatosClima(name, coords).catch(error => {
                console.error(`Error en ${name}:`, error);
                return null;
            })
        );

        const resultados = await Promise.all(promesas);
        return resultados.filter(datos => datos !== null);
    }

    /**
     * Obtiene datos de caché si están vigentes
     * @param {string} key - Clave de caché
     * @returns {Object|null} Datos en caché o null
     */
    obtenerDeCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const ahora = Date.now();
        if (ahora - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    /**
     * Guarda datos en caché
     * @param {string} key - Clave de caché
     * @param {Object} data - Datos a guardar
     */
    guardarEnCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    /**
     * Limpia toda la caché
     */
    limpiarCache() {
        this.cache.clear();
        console.log('✓ Caché limpiada');
    }

    /**
     * Obtiene el nombre del modelo según el índice
     * @private
     * @param {number} index - Índice del modelo
     * @returns {string} Nombre del modelo
     */
    _obtenerNombreModelo(index) {
        const modelos = ['ecmwf_ifs025', 'gfs_graphcast025', 'icon_global'];
        return modelos[index] || `modelo_${index}`;
    }

    /**
     * Obtiene datos horarios para un rango específico
     * @param {Object} datosClima - Datos de clima con hourly
     * @param {Date} fechaInicio - Fecha de inicio (opcional)
     * @param {Date} fechaFin - Fecha de fin (opcional)
     * @returns {Array<Object>} Array de datos horarios filtrados
     */
    obtenerDatosHorarios(datosClima, fechaInicio = null, fechaFin = null) {
        if (!datosClima.hourly || !datosClima.hourly.time) {
            return [];
        }

        const { time, temperature_2m, precipitation, wind_speed_10m, weather_code } = datosClima.hourly;

        return time.map((timestamp, index) => {
            const fecha = new Date(timestamp);

            // Filtrar por rango de fechas si se especifica
            if (fechaInicio && fecha < fechaInicio) return null;
            if (fechaFin && fecha > fechaFin) return null;

            return {
                time: fecha,
                temperature_2m: temperature_2m[index],
                precipitation: precipitation[index],
                wind_speed_10m: wind_speed_10m[index],
                weather_code: weather_code[index]
            };
        }).filter(item => item !== null);
    }

    /**
     * Compara datos de múltiples modelos meteorológicos
     * @param {Object} datosClima - Datos de clima con múltiples modelos
     * @returns {Object} Comparación de modelos
     */
    compararModelos(datosClima) {
        if (!datosClima.models || datosClima.models.length === 0) {
            console.warn('No hay modelos disponibles para comparar');
            return null;
        }

        const comparacion = {
            modelos: datosClima.models.length,
            promedios: {},
            diferencias: []
        };

        // Calcular promedios de temperatura por modelo
        datosClima.models.forEach(modelo => {
            if (modelo.current && modelo.current.temperature_2m) {
                comparacion.promedios[modelo.model] = {
                    temperatura: modelo.current.temperature_2m,
                    humedad: modelo.current.relative_humidity_2m,
                    viento: modelo.current.wind_speed_10m
                };
            }
        });

        // Calcular diferencias entre modelos
        const modelos = Object.keys(comparacion.promedios);
        for (let i = 0; i < modelos.length - 1; i++) {
            for (let j = i + 1; j < modelos.length; j++) {
                const diffTemp = Math.abs(
                    comparacion.promedios[modelos[i]].temperatura -
                    comparacion.promedios[modelos[j]].temperatura
                );

                if (diffTemp > 2) { // Diferencia significativa
                    comparacion.diferencias.push({
                        modelo1: modelos[i],
                        modelo2: modelos[j],
                        diferenciaTemperatura: diffTemp.toFixed(1)
                    });
                }
            }
        }

        return comparacion;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ApiClient = ApiClient;
}
