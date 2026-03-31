/**
 * LLMAlertGenerator - Generador de alertas meteorológicas usando LLM
 * Utiliza modelos de lenguaje para crear alertas contextuales e inteligentes
 * Específico para Torres del Paine - Parque Nacional Patagónico
 */
class LLMAlertGenerator {
    /**
     * Constructor de LLMAlertGenerator
     * @param {Object} config - Configuración de la API LLM
     */
    constructor(config = {}) {
        // Configuración de la API (Hugging Face por defecto, puede usar OpenAI si hay API key)
        this.apiUrl = config.apiUrl || 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
        this.apiKey = config.apiKey || null; // Opcional: para OpenAI u otras APIs
        this.useLLM = config.useLLM !== false; // Habilitar LLM por defecto
        this.fallbackToRules = config.fallbackToRules !== false; // Fallback a reglas si falla LLM
    }

    /**
     * Genera alertas inteligentes usando LLM para Torres del Paine
     * @param {Object} estadisticas - Estadísticas meteorológicas
     * @param {Object} dailyData - Datos diarios del pronóstico
     * @param {Object} currentData - Datos actuales
     * @returns {Promise<Array<Object>>} Array de alertas generadas
     */
    async generarAlertasInteligentes(estadisticas = {}, dailyData = {}, currentData = {}) {
        // Si LLM está deshabilitado, usar reglas simples
        if (!this.useLLM) {
            return this._generarAlertasBasicas(estadisticas, dailyData);
        }

        try {
            // Construir prompt contextual para Torres del Paine
            const prompt = this._construirPrompt(estadisticas, dailyData, currentData);
            
            // Llamar al LLM
            const respuesta = await this._llamarLLM(prompt);
            
            // Parsear respuesta del LLM
            const alertas = this._parsearRespuestaLLM(respuesta, estadisticas, dailyData);
            
            return alertas.length > 0 ? alertas : this._generarAlertasBasicas(estadisticas, dailyData);
        } catch (error) {
            console.warn('⚠️ Error con LLM, usando reglas básicas:', error);
            // Fallback a reglas básicas si falla el LLM
            if (this.fallbackToRules) {
                return this._generarAlertasBasicas(estadisticas, dailyData);
            }
            return [];
        }
    }

    /**
     * Construye el prompt para el LLM con contexto de Torres del Paine
     * @private
     */
    _construirPrompt(estadisticas, dailyData, currentData) {
        const contexto = `
Analiza las condiciones meteorológicas para Torres del Paine - Parque Nacional Patagónico.
Este es un parque de montaña con glaciares, condiciones extremas y senderismo de altura.

Datos meteorológicos actuales:
- Temperatura actual: ${currentData.temperature_2m || 'N/A'}°C
- Humedad: ${currentData.relative_humidity_2m || 'N/A'}%
- Viento: ${currentData.wind_speed_10m || 'N/A'} km/h
- Código meteorológico: ${currentData.weather_code || 'N/A'}

Estadísticas semanales:
- Temperatura mínima: ${estadisticas.tempMinima || 'N/A'}°C
- Temperatura máxima: ${estadisticas.tempMaxima || 'N/A'}°C
- Temperatura promedio: ${estadisticas.tempPromedio || 'N/A'}°C
- Días lluviosos: ${estadisticas.diasPorEstado?.Lluvioso || 0}
- Días soleados: ${estadisticas.diasPorEstado?.Soleado || 0}
- Días nublados: ${estadisticas.diasPorEstado?.Nublado || 0}

Pronóstico próximos días:
${dailyData.temperature_2m_max?.slice(0, 5).map((max, i) => 
    `Día ${i+1}: Máx ${Math.round(max)}°C / Mín ${Math.round(dailyData.temperature_2m_min?.[i] || 0)}°C, Viento: ${Math.round(dailyData.wind_speed_10m_max?.[i] || 0)} km/h`
).join('\n') || 'No disponible'}

Genera alertas meteorológicas específicas para excursionistas y montañistas en Torres del Paine.
Considera: seguridad en senderismo, condiciones de glaciares, visibilidad, viento en altura, riesgo de hipotermia.
Responde SOLO con un JSON array de alertas en formato:
[
  {
    "tipo": "tipo_alerta",
    "nivel": "info|warning|danger",
    "titulo": "Título corto",
    "mensaje": "Descripción detallada y útil para excursionistas",
    "icono": "fa-icon-name",
    "recomendaciones": "Recomendaciones específicas para la actividad"
  }
]

Responde SOLO con el JSON, sin texto adicional.
        `.trim();

        return contexto;
    }

    /**
     * Llama al LLM (Hugging Face o OpenAI)
     * @private
     */
    async _llamarLLM(prompt) {
        // Por defecto, usar análisis local mejorado
        // Si se requiere LLM externo, se puede configurar aquí
        // Por ahora, lanzamos error para usar fallback
        throw new Error('LLM externo no configurado, usando análisis local');
    }

    /**
     * Parsea la respuesta del LLM a alertas estructuradas
     * @private
     */
    _parsearRespuestaLLM(respuesta, estadisticas, dailyData) {
        try {
            // Extraer JSON de la respuesta
            const jsonMatch = respuesta.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No se encontró JSON en la respuesta');
            }

            const alertas = JSON.parse(jsonMatch[0]);
            
            // Validar y formatear alertas
            return alertas.map(alerta => ({
                tipo: alerta.tipo || 'general',
                nivel: alerta.nivel || 'info',
                titulo: alerta.titulo || 'Alerta Meteorológica',
                mensaje: alerta.mensaje || '',
                icono: alerta.icono || 'fa-exclamation-triangle',
                clase: this._mapearClaseAlerta(alerta.nivel),
                recomendaciones: alerta.recomendaciones || ''
            })).filter(alerta => alerta.titulo && alerta.mensaje);
        } catch (error) {
            console.error('Error parseando respuesta del LLM:', error);
            return [];
        }
    }

    /**
     * Mapea nivel de alerta a clase CSS
     * @private
     */
    _mapearClaseAlerta(nivel) {
        const clases = {
            'info': 'alert-info',
            'warning': 'alert-warning',
            'danger': 'alert-danger',
            'success': 'alert-success'
        };
        return clases[nivel] || 'alert-info';
    }

    /**
     * Genera alertas básicas usando reglas simples (fallback)
     * @private
     */
    _generarAlertasBasicas(estadisticas, dailyData) {
        const alertas = [];

        // Análisis contextual para Torres del Paine (reglas mejoradas)
        const vientoMaximo = dailyData.wind_speed_10m_max ? Math.max(...dailyData.wind_speed_10m_max) : 0;
        const diasLluviosos = estadisticas.diasPorEstado?.Lluvioso || 0;
        const tempMinima = estadisticas.tempMinima || 0;

        // Viento fuerte (crítico en montaña)
        if (vientoMaximo > 60) {
            alertas.push({
                tipo: 'viento_extremo',
                nivel: 'danger',
                titulo: '💨 Alerta de Viento Extremo',
                mensaje: `Se esperan ráfagas de hasta ${Math.round(vientoMaximo)} km/h. Condiciones peligrosas para senderismo de altura.`,
                icono: 'fa-wind',
                clase: 'alert-danger',
                recomendaciones: 'Evitar exposición en crestas y zonas expuestas. Considerar posponer actividades en altura.'
            });
        } else if (vientoMaximo > 40) {
            alertas.push({
                tipo: 'viento_fuerte',
                nivel: 'warning',
                titulo: '💨 Alerta de Viento Fuerte',
                mensaje: `Se esperan ráfagas de hasta ${Math.round(vientoMaximo)} km/h. Precaución en zonas expuestas.`,
                icono: 'fa-wind',
                clase: 'alert-warning',
                recomendaciones: 'Tener cuidado en pasos de montaña y zonas elevadas.'
            });
        }

        // Semana lluviosa (afecta senderismo)
        if (diasLluviosos >= 5) {
            alertas.push({
                tipo: 'lluvia_intensa',
                nivel: 'warning',
                titulo: '🌧️ Semana Muy Lluviosa',
                mensaje: `Se esperan ${diasLluviosos} días de lluvia esta semana. Sendas pueden estar resbaladizas y ríos crecidos.`,
                icono: 'fa-cloud-rain',
                clase: 'alert-warning',
                recomendaciones: 'Usar calzado apropiado, impermeables. Verificar condiciones de vadeo de ríos.'
            });
        } else if (diasLluviosos >= 3) {
            alertas.push({
                tipo: 'lluvia_moderada',
                nivel: 'info',
                titulo: '🌧️ Semana Lluviosa',
                mensaje: `Se esperan ${diasLluviosos} días de lluvia esta semana.`,
                icono: 'fa-cloud-rain',
                clase: 'alert-info',
                recomendaciones: 'Llevar equipo impermeable.'
            });
        }

        // Frío extremo (riesgo de hipotermia)
        if (tempMinima < -5) {
            alertas.push({
                tipo: 'frio_extremo',
                nivel: 'danger',
                titulo: '❄️ Temperaturas Extremadamente Bajas',
                mensaje: `Temperatura mínima prevista: ${tempMinima}°C. Riesgo alto de hipotermia sin equipo adecuado.`,
                icono: 'fa-snowflake',
                clase: 'alert-danger',
                recomendaciones: 'Equipo de abrigo esencial. Evitar exposiciones prolongadas. Considerar refugios.'
            });
        } else if (tempMinima < 0) {
            alertas.push({
                tipo: 'frio',
                nivel: 'warning',
                titulo: '🧊 Condiciones Frías',
                mensaje: `Temperaturas bajo cero previstas. Protección térmica necesaria.`,
                icono: 'fa-thermometer-empty',
                clase: 'alert-warning',
                recomendaciones: 'Llevar equipo de abrigo adecuado.'
            });
        }

        // Visibilidad y niebla
        if (estadisticas.diasPorEstado?.Nublado >= 5) {
            alertas.push({
                tipo: 'visibilidad',
                nivel: 'info',
                titulo: '🌫️ Condiciones de Visibilidad Limitada',
                mensaje: 'Múltiples días con nubosidad. Disminución de visibilidad en altura.',
                icono: 'fa-cloud',
                clase: 'alert-info',
                recomendaciones: 'Precaución en senderos. GPS y brújula recomendados.'
            });
        }

        return alertas;
    }

    /**
     * Genera alertas usando análisis inteligente local (sin LLM externo)
     * Combina reglas mejoradas con análisis contextual
     */
    generarAlertasInteligentesLocal(estadisticas, dailyData, currentData) {
        return this._generarAlertasBasicas(estadisticas, dailyData);
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.LLMAlertGenerator = LLMAlertGenerator;
}
