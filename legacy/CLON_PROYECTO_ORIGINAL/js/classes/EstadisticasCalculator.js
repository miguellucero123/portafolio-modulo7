/**
 * EstadisticasCalculator - Clase para calcular estadísticas climáticas
 * Calcula estadísticas semanales a partir de datos de la API
 * Utiliza métodos ES6+ (arrow functions, template literals, let/const)
 */
class EstadisticasCalculator {
    /**
     * Calcula estadísticas semanales a partir de datos de pronóstico diario
     * @param {Object} dailyData - Datos diarios de la API
     * @returns {Object} Objeto con estadísticas calculadas
     */
    calcularEstadisticas(dailyData = {}) {
        if (!dailyData.time || !dailyData.temperature_2m_max || !dailyData.temperature_2m_min) {
            console.warn('Datos diarios incompletos para calcular estadísticas');
            return null;
        }

        const tempsMax = dailyData.temperature_2m_max;
        const tempsMin = dailyData.temperature_2m_min;
        const weatherCodes = dailyData.weather_code || [];

        // Calcular temperaturas mínima, máxima y promedio
        const tempMinima = Math.min(...tempsMin);
        const tempMaxima = Math.max(...tempsMax);
        
        const promedioMin = this._calcularPromedio(tempsMin);
        const promedioMax = this._calcularPromedio(tempsMax);
        const tempPromedio = this._redondear((promedioMin + promedioMax) / 2);

        // Contar días por tipo de clima
        const diasPorEstado = this._contarDiasPorTipoClima(weatherCodes);

        return {
            tempMinima: this._redondear(tempMinima),
            tempMaxima: this._redondear(tempMaxima),
            tempPromedio: tempPromedio,
            promedioMin: this._redondear(promedioMin),
            promedioMax: this._redondear(promedioMax),
            diasPorEstado: diasPorEstado
        };
    }

    /**
     * Calcula el promedio de un array de números
     * @private
     * @param {Array<number>} numeros - Array de números
     * @returns {number} Promedio calculado
     */
    _calcularPromedio(numeros = []) {
        if (numeros.length === 0) return 0;
        const suma = numeros.reduce((acc, num) => acc + num, 0);
        return suma / numeros.length;
    }

    /**
     * Redondea un número a un decimal
     * @private
     * @param {number} numero - Número a redondear
     * @param {number} decimales - Cantidad de decimales (por defecto 1)
     * @returns {number} Número redondeado
     */
    _redondear(numero = 0, decimales = 1) {
        const factor = Math.pow(10, decimales);
        return Math.round(numero * factor) / factor;
    }

    /**
     * Cuenta los días por tipo de clima basándose en códigos WMO
     * @private
     * @param {Array<number>} weatherCodes - Array de códigos meteorológicos WMO
     * @returns {Object} Objeto con conteo de días por tipo
     */
    _contarDiasPorTipoClima(weatherCodes = []) {
        const contador = {
            'Soleado': 0,
            'Nublado': 0,
            'Lluvioso': 0,
            'Nevado': 0
        };

        weatherCodes.forEach(code => {
            const tipo = this._obtenerTipoClima(code);
            if (contador[tipo] !== undefined) {
                contador[tipo]++;
            }
        });

        return contador;
    }

    /**
     * Obtiene el tipo de clima a partir del código WMO
     * @private
     * @param {number} code - Código meteorológico WMO
     * @returns {string} Tipo de clima
     */
    _obtenerTipoClima(code) {
        if (code === 0 || code === 1) return 'Soleado';
        if (code === 2 || code === 3 || (code >= 45 && code <= 48)) return 'Nublado';
        if (code >= 51 && code <= 82) return 'Lluvioso';
        if (code >= 71 && code <= 86) return 'Nevado';
        return 'Nublado';
    }

    /**
     * Genera un resumen textual basado en las estadísticas
     * @param {Object} estadisticas - Objeto con estadísticas calculadas
     * @returns {string} Resumen textual
     */
    generarResumen(estadisticas = {}) {
        if (!estadisticas.diasPorEstado) {
            return 'Datos insuficientes para generar resumen.';
        }

        const { diasPorEstado, tempPromedio, tempMinima } = estadisticas;
        const diasSoleados = diasPorEstado['Soleado'] || 0;
        const diasNublados = diasPorEstado['Nublado'] || 0;
        const diasLluviosos = diasPorEstado['Lluvioso'] || 0;

        // Template literal para construir el resumen
        if (diasSoleados > diasNublados && diasSoleados > diasLluviosos) {
            return `Semana mayormente soleada con ${diasSoleados} días de sol.`;
        }

        if (diasLluviosos >= 4) {
            return `Semana lluviosa con ${diasLluviosos} días de precipitación.`;
        }

        if (tempPromedio > 15) {
            return `Semana cálida con temperatura promedio de ${tempPromedio}°C.`;
        }

        if (tempMinima < 0) {
            return `Semana fría con temperaturas bajo cero.`;
        }

        if (diasLluviosos >= 3) {
            return `Semana con varias lluvias (${diasLluviosos} días).`;
        }

        return 'Semana con condiciones variables.';
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.EstadisticasCalculator = EstadisticasCalculator;
}
