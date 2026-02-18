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
        const apparentMax = dailyData.apparent_temperature_max || [];
        const apparentMin = dailyData.apparent_temperature_min || [];
        const precipitation = dailyData.precipitation_sum || [];
        const showers = dailyData.showers_sum || [];
        const snowfall = dailyData.snowfall_sum || [];
        const probability = dailyData.precipitation_probability_max || [];
        const weatherCodes = dailyData.weather_code || [];

        // Calcular temperaturas mínima, máxima y promedio
        const tempMinima = Math.min(...tempsMin);
        const tempMaxima = Math.max(...tempsMax);

        const promedioMin = this._calcularPromedio(tempsMin);
        const promedioMax = this._calcularPromedio(tempsMax);
        const tempPromedio = this._redondear((promedioMin + promedioMax) / 2);

        // Sensación térmica
        const appPromedioMin = apparentMin.length > 0 ? this._calcularPromedio(apparentMin) : promedioMin;
        const appPromedioMax = apparentMax.length > 0 ? this._calcularPromedio(apparentMax) : promedioMax;
        const sensacionPromedio = this._redondear((appPromedioMin + appPromedioMax) / 2);

        // Precipitaciones
        const totalLluvia = this._redondear(showers.reduce((acc, val) => acc + (val || 0), 0));
        const totalNieve = this._redondear(snowfall.reduce((acc, val) => acc + (val || 0), 0));
        const picoPrecipitacion = precipitation.length > 0 ? Math.max(...precipitation.map(p => p || 0)) : 0;
        const probabilidadMaxima = probability.length > 0 ? Math.max(...probability.map(p => p || 0)) : 0;

        // Contar días por tipo de clima
        const diasPorEstado = this._contarDiasPorTipoClima(weatherCodes);

        return {
            tempMinima: this._redondear(tempMinima),
            tempMaxima: this._redondear(tempMaxima),
            tempPromedio: tempPromedio,
            sensacionPromedio: sensacionPromedio,
            promedioMin: this._redondear(promedioMin),
            promedioMax: this._redondear(promedioMax),
            totalLluvia: totalLluvia,
            totalNieve: totalNieve,
            picoPrecipitacion: this._redondear(picoPrecipitacion),
            probabilidadMaxima: Math.round(probabilidadMaxima),
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
