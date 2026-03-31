# 🤖 Configuración de Alertas con LLM para Torres del Paine

## 📋 Resumen

El sistema de alertas ahora está **enfocado exclusivamente en Torres del Paine** y utiliza análisis inteligente para generar alertas contextuales relevantes para excursionistas y montañistas.

## 🎯 Características

### 1. Alertas Solo para Torres del Paine
- Las alertas meteorológicas solo se generan para **Torres del Paine - Glaciar Grey**
- Otras ciudades no muestran alertas en la sección de estadísticas
- Esto permite un enfoque especializado en las condiciones críticas de montaña

### 2. Sistema de Análisis Inteligente

El sistema tiene **dos modos de operación**:

#### **Modo 1: Análisis Local Mejorado (Activo por Defecto)**
- **No requiere API key**
- Usa reglas mejoradas específicas para montaña y glaciares
- Considera:
  - Viento extremo (>60 km/h) - Crítico en altura
  - Viento fuerte (40-60 km/h) - Precaución
  - Semana muy lluviosa (≥5 días) - Sendas peligrosas
  - Temperaturas extremadamente bajas (<-5°C) - Riesgo de hipotermia
  - Visibilidad limitada por nubosidad
- Incluye **recomendaciones específicas** para excursionistas

#### **Modo 2: LLM (Opcional, requiere configuración)**
- Utiliza modelos de lenguaje para análisis contextual
- Genera alertas más descriptivas y contextuales
- Puede usar **Hugging Face** (gratis) u **OpenAI** (requiere API key)

## 🔧 Configuración

### Opción A: Solo Análisis Local (Recomendado - Ya Activo)

No requiere configuración. El sistema usa análisis inteligente local mejorado.

### Opción B: Habilitar LLM (Opcional)

#### Usando Hugging Face (Gratis)

Edita `js/classes/WeatherApp.js` línea 22-26:

```javascript
this.llmAlertGenerator = typeof LLMAlertGenerator !== 'undefined' 
    ? new LLMAlertGenerator({
        useLLM: true, // Habilitar LLM
        apiUrl: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        fallbackToRules: true // Usar reglas si falla LLM
    })
    : null;
```

#### Usando OpenAI (Requiere API Key)

```javascript
this.llmAlertGenerator = typeof LLMAlertGenerator !== 'undefined' 
    ? new LLMAlertGenerator({
        useLLM: true,
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: 'tu-api-key-aqui', // ⚠️ NUNCA commites esto
        model: 'gpt-3.5-turbo',
        fallbackToRules: true
    })
    : null;
```

**⚠️ Seguridad:** Si usas OpenAI, guarda la API key en una variable de entorno o archivo de configuración que NO se suba a Git.

## 📊 Alertas Generadas

Las alertas incluyen:

1. **Título descriptivo** con icono
2. **Mensaje detallado** explicando la condición
3. **Recomendaciones específicas** para excursionistas
4. **Nivel de severidad** (info, warning, danger)

### Ejemplos de Alertas:

- **Viento Extremo**: "Se esperan ráfagas de hasta 93 km/h. Condiciones peligrosas para senderismo de altura."
  - Recomendación: "Evitar exposición en crestas y zonas expuestas."
  
- **Semana Muy Lluviosa**: "Se esperan 8 días de lluvia esta semana. Sendas pueden estar resbaladizas."
  - Recomendación: "Usar calzado apropiado, impermeables. Verificar condiciones de vadeo de ríos."
  
- **Frío Extremo**: "Temperatura mínima prevista: -8°C. Riesgo alto de hipotermia."
  - Recomendación: "Equipo de abrigo esencial. Evitar exposiciones prolongadas."

## 🔍 Ubicación de las Alertas

- **Vista de Estadísticas**: Sección "Alertas Activas" - Solo Torres del Paine
- **Vista de Detalle**: Sección de alertas en el detalle de Torres del Paine

## 🧪 Probar el Sistema

1. **Recarga la aplicación** (F5)
2. **Ve a "Estadísticas"** en la navegación
3. **Verás las alertas** solo para Torres del Paine
4. **Las alertas se generan** usando análisis local mejorado

## 🔮 Próximos Pasos

- Integrar con más modelos de LLM
- Aprendizaje automático para ajustar umbrales
- Alertas personalizadas por tipo de actividad (trekking, escalada, etc.)
- Notificaciones en tiempo real

---

**Nota**: El LLM está deshabilitado por defecto para evitar costos de API y problemas de conectividad. El sistema de análisis local mejorado proporciona alertas de calidad sin dependencias externas.
