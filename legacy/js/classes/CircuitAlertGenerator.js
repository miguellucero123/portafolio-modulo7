/**
 * CircuitAlertGenerator - Generador de alertas por día y por sector de los circuitos W y O
 * Genera alertas detalladas para cada sector y cada día del pronóstico
 */
class CircuitAlertGenerator {
    /**
     * Constructor de CircuitAlertGenerator
     * @param {ApiClient} apiClient - Cliente API para obtener datos meteorológicos
     */
    constructor(apiClient) {
        this.apiClient = apiClient;

        // Sectores de los circuitos W y O con coordenadas
        this.sectores = {
            // Circuito W
            "Sector Grey": { lat: -51.0, lon: -73.23, circuito: "W", icon: "fa-snowflake", orden: 1 },
            "Sector Paine Grande": { lat: -50.955, lon: -73.12, circuito: "W", icon: "fa-house", orden: 2 },
            "Sector Francés": { lat: -50.968, lon: -73.085, circuito: "W", icon: "fa-tree", orden: 3 },
            "Sector Cuernos": { lat: -50.938, lon: -73.02, circuito: "W", icon: "fa-mountain", orden: 4 },
            "Sector Chileno": { lat: -50.942, lon: -72.967, circuito: "W", icon: "fa-campground", orden: 5 },
            "Sector Central": { lat: -50.942, lon: -72.95, circuito: "W", icon: "fa-building", orden: 6 },
            // Circuito O
            "Sector Serón": { lat: -50.935, lon: -72.93, circuito: "O", icon: "fa-campground", orden: 1 },
            "Sector Dickson": { lat: -50.87, lon: -72.98, circuito: "O", icon: "fa-campground", orden: 2 },
            "Sector Perros": { lat: -50.82, lon: -73.08, circuito: "O", icon: "fa-campground", orden: 3 }
        };

        this.llmGenerator = typeof LLMAlertGenerator !== 'undefined'
            ? new LLMAlertGenerator({ useLLM: false, fallbackToRules: true })
            : null;
    }

    /**
     * Genera alertas por día y por sector para los circuitos W y O
     * @returns {Promise<Array<Object>>} Array de alertas organizadas por día y sector
     */
    async generarAlertasPorDiaYLugar() {
        const alertasPorDia = {};
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        // Obtener datos meteorológicos para cada sector
        const sectoresData = await this._obtenerDatosTodosSectores();

        // Para cada día del pronóstico (7 días)
        for (let diaIndex = 0; diaIndex < 7; diaIndex++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + diaIndex);
            const nombreDia = diasSemana[fecha.getDay()];
            const fechaStr = fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

            alertasPorDia[diaIndex] = {
                dia: nombreDia,
                fecha: fechaStr,
                fechaCompleta: fecha.toISOString().split('T')[0],
                alertas: []
            };

            // Generar alertas para cada sector
            for (const [nombreSector, sector] of Object.entries(this.sectores)) {
                const datosSector = sectoresData[nombreSector];
                if (!datosSector || !datosSector.daily) continue;

                // Obtener datos del día específico
                const datosDia = this._extraerDatosDia(datosSector.daily, diaIndex);
                if (!datosDia) continue;

                // Generar alertas para este sector en este día
                const alertasSector = this._generarAlertasSectorDia(nombreSector, sector, datosDia, diaIndex);

                if (alertasSector && alertasSector.length > 0) {
                    alertasPorDia[diaIndex].alertas.push(...alertasSector);
                }
            }
        }

        // Convertir a array y filtrar días sin alertas
        return Object.values(alertasPorDia).filter(dia => dia.alertas.length > 0);
    }

    /**
     * Obtiene datos meteorológicos para todos los sectores
     * @private
     */
    async _obtenerDatosTodosSectores() {
        const sectoresData = {};

        // Obtener datos para cada sector con delay para evitar rate limiting
        for (const [nombre, sector] of Object.entries(this.sectores)) {
            try {
                const datos = await this.apiClient.obtenerDatosClima(nombre, { lat: sector.lat, lon: sector.lon });
                if (datos) {
                    sectoresData[nombre] = datos;
                }
                // Delay entre peticiones para evitar rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.warn(`Error obteniendo datos para ${nombre}:`, error);
            }
        }

        return sectoresData;
    }

    /**
     * Extrae datos de un día específico del pronóstico
     * @private
     */
    _extraerDatosDia(dailyData, diaIndex) {
        if (!dailyData || !dailyData.time || diaIndex >= dailyData.time.length) {
            return null;
        }

        // Verificar que el día sea futuro
        const fechaStr = dailyData.time[diaIndex];
        const fecha = new Date(fechaStr);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        fecha.setHours(0, 0, 0, 0);

        // Solo incluir días futuros (pronóstico real)
        if (fecha <= hoy) {
            return null; // Saltar días pasados
        }

        return {
            fecha: fechaStr,
            tempMax: dailyData.temperature_2m_max?.[diaIndex],
            tempMin: dailyData.temperature_2m_min?.[diaIndex],
            sensacionMax: dailyData.apparent_temperature_max?.[diaIndex],
            sensacionMin: dailyData.apparent_temperature_min?.[diaIndex],
            weatherCode: dailyData.weather_code?.[diaIndex],
            vientoMax: dailyData.wind_speed_10m_max?.[diaIndex],
            vientoRacha: dailyData.wind_gusts_10m_max?.[diaIndex],
            precipitacion: dailyData.precipitation_sum?.[diaIndex] || 0,
            lluvia_showers: dailyData.showers_sum?.[diaIndex] || 0,
            nieve: dailyData.snowfall_sum?.[diaIndex] || 0,
            probabilidadLluvia: dailyData.precipitation_probability_max?.[diaIndex] || 0,
            humedad: dailyData.relative_humidity_2m_max?.[diaIndex]
        };
    }

    /**
     * Genera alertas específicas para un sector en un día
     * @private
     */
    _generarAlertasSectorDia(nombreSector, sector, datosDia, diaIndex) {
        const alertas = [];

        // Alerta de viento extremo (crítico en montaña)
        if (datosDia.vientoRacha && datosDia.vientoRacha > 60) {
            alertas.push({
                sector: nombreSector,
                circuito: sector.circuito,
                icono: sector.icon,
                tipo: 'viento_extremo',
                nivel: 'danger',
                titulo: '💨 Viento Extremo',
                mensaje: `Ráfagas de hasta ${Math.round(datosDia.vientoRacha)} km/h. Condiciones peligrosas para senderismo.`,
                recomendaciones: 'Evitar exposición en crestas y zonas expuestas. Considerar posponer actividades.',
                tempMax: Math.round(datosDia.tempMax),
                tempMin: Math.round(datosDia.tempMin),
                vientoMax: Math.round(datosDia.vientoMax || 0),
                precipitacion: datosDia.precipitacion || 0
            });
        } else if (datosDia.vientoRacha && datosDia.vientoRacha > 40) {
            alertas.push({
                sector: nombreSector,
                circuito: sector.circuito,
                icono: sector.icon,
                tipo: 'viento_fuerte',
                nivel: 'warning',
                titulo: '💨 Viento Fuerte',
                mensaje: `Ráfagas de hasta ${Math.round(datosDia.vientoRacha)} km/h. Precaución en zonas expuestas.`,
                recomendaciones: 'Tener cuidado en pasos de montaña.',
                tempMax: Math.round(datosDia.tempMax),
                tempMin: Math.round(datosDia.tempMin),
                vientoMax: Math.round(datosDia.vientoMax || 0),
                precipitacion: datosDia.precipitacion || 0
            });
        }

        // Alerta de lluvia intensa
        if (datosDia.precipitacion && datosDia.precipitacion > 5) {
            alertas.push({
                sector: nombreSector,
                circuito: sector.circuito,
                icono: sector.icon,
                tipo: 'lluvia_intensa',
                nivel: 'warning',
                titulo: '🌧️ Lluvia Intensa',
                mensaje: `Precipitación prevista: ${Math.round(datosDia.precipitacion)}mm. Sendas resbaladizas.`,
                recomendaciones: 'Usar calzado apropiado, impermeables. Verificar condiciones de vadeo.',
                tempMax: Math.round(datosDia.tempMax),
                tempMin: Math.round(datosDia.tempMin),
                vientoMax: Math.round(datosDia.vientoMax || 0),
                precipitacion: datosDia.precipitacion || 0
            });
        } else if (datosDia.precipitacion && datosDia.precipitacion > 2) {
            alertas.push({
                sector: nombreSector,
                circuito: sector.circuito,
                icono: sector.icon,
                tipo: 'lluvia',
                nivel: 'info',
                titulo: '🌧️ Lluvia',
                mensaje: `Precipitación prevista: ${Math.round(datosDia.precipitacion)}mm.`,
                recomendaciones: 'Llevar equipo impermeable.',
                tempMax: Math.round(datosDia.tempMax),
                tempMin: Math.round(datosDia.tempMin),
                vientoMax: Math.round(datosDia.vientoMax || 0),
                precipitacion: datosDia.precipitacion || 0
            });
        }

        // Alerta de nieve
        if (datosDia.nieve && datosDia.nieve > 0) {
            const nivelNieve = datosDia.nieve > 5 ? 'danger' : 'warning';
            alertas.push({
                sector: nombreSector,
                circuito: sector.circuito,
                icono: 'fa-snowflake',
                tipo: 'nieve',
                nivel: nivelNieve,
                titulo: datosDia.nieve > 5 ? '❄️ Nevada Intensa' : '❄️ Nevada',
                mensaje: `Nieve prevista: ${Math.round(datosDia.nieve)} cm. Visibilidad reducida y senderos cubiertos.`,
                recomendaciones: 'Uso de polainas y equipo técnico. Riesgo de pérdida de senda.',
                tempMax: Math.round(datosDia.tempMax),
                tempMin: Math.round(datosDia.tempMin),
                sensacionMin: Math.round(datosDia.sensacionMin || datosDia.tempMin),
                vientoMax: Math.round(datosDia.vientoMax || 0),
                precipitacion: datosDia.precipitacion || 0
            });
        }

        // Alerta de frío extremo (usando sensación térmica)
        const sMin = datosDia.sensacionMin !== undefined ? datosDia.sensacionMin : datosDia.tempMin;
        if (sMin < -5) {
            alertas.push({
                sector: nombreSector,
                circuito: sector.circuito,
                icono: sector.icon,
                tipo: 'frio_extremo',
                nivel: 'danger',
                titulo: '🧊 Frío Extremo',
                mensaje: `Sensación térmica mínima: ${Math.round(sMin)}°C. Riesgo alto de congelación/hipotermia.`,
                recomendaciones: 'Sistema de capas esencial. Cubrir extremidades y rostro.',
                tempMax: Math.round(datosDia.tempMax),
                tempMin: Math.round(datosDia.tempMin),
                sensacionMin: Math.round(sMin),
                vientoMax: Math.round(datosDia.vientoMax || 0),
                precipitacion: datosDia.precipitacion || 0
            });
        } else if (sMin < 2) {
            alertas.push({
                sector: nombreSector,
                circuito: sector.circuito,
                icono: sector.icon,
                tipo: 'frio',
                nivel: 'warning',
                titulo: '🌬️ Frío Significativo',
                mensaje: `Sensación térmica mínima: ${Math.round(sMin)}°C.`,
                recomendaciones: 'Llevar abrigo técnico y cortavientos.',
                tempMax: Math.round(datosDia.tempMax),
                tempMin: Math.round(datosDia.tempMin),
                sensacionMin: Math.round(sMin),
                vientoMax: Math.round(datosDia.vientoMax || 0),
                precipitacion: datosDia.precipitacion || 0
            });
        }

        // Alerta de probabilidad alta de lluvia
        if (datosDia.probabilidadLluvia && datosDia.probabilidadLluvia > 70) {
            alertas.push({
                sector: nombreSector,
                circuito: sector.circuito,
                icono: sector.icon,
                tipo: 'probabilidad_lluvia',
                nivel: 'info',
                titulo: '🌦️ Alta Probabilidad de Lluvia',
                mensaje: `Probabilidad de lluvia: ${Math.round(datosDia.probabilidadLluvia)}%`,
                recomendaciones: 'Preparar equipo impermeable.',
                tempMax: Math.round(datosDia.tempMax),
                tempMin: Math.round(datosDia.tempMin),
                vientoMax: Math.round(datosDia.vientoMax || 0),
                precipitacion: datosDia.precipitacion || 0
            });
        }

        return alertas;
    }

    /**
     * Obtiene todos los sectores disponibles
     * @returns {Object} Objeto con sectores por circuito
     */
    obtenerSectores() {
        return {
            W: Object.entries(this.sectores)
                .filter(([_, sector]) => sector.circuito === 'W')
                .map(([nombre, sector]) => ({ nombre, ...sector }))
                .sort((a, b) => a.orden - b.orden),
            O: Object.entries(this.sectores)
                .filter(([_, sector]) => sector.circuito === 'O')
                .map(([nombre, sector]) => ({ nombre, ...sector }))
                .sort((a, b) => a.orden - b.orden)
        };
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CircuitAlertGenerator = CircuitAlertGenerator;
}
