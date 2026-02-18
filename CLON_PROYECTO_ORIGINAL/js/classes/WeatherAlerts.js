/**
 * WeatherAlerts - Clase para gestionar alertas meteorológicas
 * Evalúa condiciones climáticas y genera alertas según reglas simples
 * Utiliza ES6+ features (arrow functions, template literals, default parameters)
 */
class WeatherAlerts {
    /**
     * Constructor de WeatherAlerts
     * @param {Object} config - Configuración de umbrales para alertas
     */
    constructor(config = {}) {
        // Parámetros por defecto con destructuring
        const {
            umbralCalor = 25,
            umbralDiasLluvia = 4,
            umbralViento = 60,
            umbralFrio = -5
        } = config;

        this.umbrales = {
            calor: umbralCalor,
            diasLluvia: umbralDiasLluvia,
            viento: umbralViento,
            frio: umbralFrio
        };
    }

    /**
     * Genera alertas basadas en estadísticas semanales
     * @param {Object} estadisticas - Estadísticas calculadas
     * @param {Object} dailyData - Datos diarios de pronóstico
     * @returns {Array<Object>} Array de alertas generadas
     */
    generarAlertas(estadisticas = {}, dailyData = {}) {
        const alertas = [];

        if (!estadisticas || !dailyData) {
            return alertas;
        }

        // Alerta de calor: temperatura promedio > umbral
        if (estadisticas.tempPromedio > this.umbrales.calor) {
            alertas.push({
                tipo: 'calor',
                nivel: 'warning',
                titulo: '🌡️ Alerta de Calor',
                mensaje: `Temperatura promedio de la semana: ${estadisticas.tempPromedio}°C (supera ${this.umbrales.calor}°C)`,
                icono: 'fa-thermometer-full',
                clase: 'alert-warning'
            });
        }

        // Alerta de semana lluviosa: días de lluvia >= umbral
        const diasLluviosos = estadisticas.diasPorEstado?.Lluvioso || 0;
        if (diasLluviosos >= this.umbrales.diasLluvia) {
            alertas.push({
                tipo: 'lluvia',
                nivel: 'info',
                titulo: '🌧️ Semana Lluviosa',
                mensaje: `Se esperan ${diasLluviosos} días de lluvia esta semana.`,
                icono: 'fa-cloud-rain',
                clase: 'alert-info'
            });
        }

        // Alerta de frío extremo: temperatura mínima < umbral
        if (estadisticas.tempMinima < this.umbrales.frio) {
            alertas.push({
                tipo: 'frio',
                nivel: 'danger',
                titulo: '❄️ Alerta de Frío Extremo',
                mensaje: `Temperatura mínima prevista: ${estadisticas.tempMinima}°C`,
                icono: 'fa-snowflake',
                clase: 'alert-danger'
            });
        }

        // Alerta de viento fuerte (basado en datos diarios)
        if (dailyData.wind_speed_10m_max) {
            const vientoMaximo = Math.max(...dailyData.wind_speed_10m_max);
            if (vientoMaximo > this.umbrales.viento) {
                alertas.push({
                    tipo: 'viento',
                    nivel: 'warning',
                    titulo: '💨 Alerta de Viento Fuerte',
                    mensaje: `Se esperan ráfagas de hasta ${Math.round(vientoMaximo)} km/h`,
                    icono: 'fa-wind',
                    clase: 'alert-warning'
                });
            }
        }

        return alertas;
    }

    /**
     * Genera HTML para mostrar alertas en la interfaz
     * @param {Array<Object>} alertas - Array de alertas
     * @returns {string} HTML formateado
     */
    renderizarAlertas(alertas = []) {
        if (!alertas || alertas.length === 0) {
            return `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> No hay alertas meteorológicas activas.
                </div>
            `;
        }

        // Template literal para construir el HTML
        const html = alertas.map(alerta => `
            <div class="alert ${alerta.clase} alert-dismissible fade show" role="alert">
                <h5 class="alert-heading">
                    <i class="fas ${alerta.icono}"></i> ${alerta.titulo}
                </h5>
                <p class="mb-0">${alerta.mensaje}</p>
                <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `).join('');

        return html;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.WeatherAlerts = WeatherAlerts;
}
