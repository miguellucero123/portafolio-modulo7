# 🎤 Guía de Presentación - Módulo 5

**Proyecto**: ClimaTorre - Torres del Paine Weather App  
**Duración sugerida**: 10-15 minutos

---

## 📋 ESTRUCTURA DE LA PRESENTACIÓN

### 1. INTRODUCCIÓN (2 min)
**Qué decir:**
- "He reestructurado la aplicación ClimaTorre utilizando Programación Orientada a Objetos y funcionalidades modernas de JavaScript ES6+"
- "La aplicación ahora consume datos reales de la API Open-Meteo en lugar de datos estáticos"
- "He implementado un sistema de alertas meteorológicas y estadísticas calculadas desde datos de la API"

**Qué mostrar:**
- Abrir la aplicación en el navegador
- Mostrar la vista Home con las ciudades cargando

---

### 2. ARQUITECTURA POO (3-4 min)
**Qué decir:**
- "He organizado el código en 4 clases principales siguiendo principios de POO"

**Clases a explicar:**

#### a) ApiClient
- **Responsabilidad**: Gestionar todas las peticiones a la API Open-Meteo
- **Mostrar código**: `js/classes/ApiClient.js` (líneas 23-93)
- **Destacar**:
  - Uso de `async/await` y `fetch()`
  - Sistema de caché para optimizar peticiones
  - Manejo de errores HTTP (incluyendo 429)

#### b) WeatherApp
- **Responsabilidad**: Clase principal que orquesta toda la aplicación
- **Mostrar código**: `js/classes/WeatherApp.js` (líneas 1-50)
- **Destacar**:
  - Constructor recibe `apiClient` (inyección de dependencias)
  - Métodos async para cargar datos
  - Coordinación entre clases

#### c) EstadisticasCalculator
- **Responsabilidad**: Calcular estadísticas semanales desde datos de la API
- **Mostrar código**: `js/classes/EstadisticasCalculator.js` (líneas 10-50)
- **Destacar**:
  - Cálculo de mínima, máxima, promedio
  - Conteo de días por tipo de clima
  - Uso de métodos privados (prefijo `_`)

#### d) WeatherAlerts
- **Responsabilidad**: Generar alertas meteorológicas basadas en reglas simples
- **Mostrar código**: `js/classes/WeatherAlerts.js` (líneas 20-60)
- **Destacar**:
  - Reglas configurables (umbrales)
  - Generación de alertas según condiciones
  - Renderizado de HTML

**Diagrama mental a mencionar:**
```
WeatherApp (orquesta)
├── ApiClient (consume API)
├── EstadisticasCalculator (calcula)
└── WeatherAlerts (genera alertas)
```

---

### 3. CARACTERÍSTICAS ES6+ (2 min)
**Qué mostrar en el código:**

#### a) Arrow Functions
```javascript
// Ejemplo en ApiClient.js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
```

#### b) Template Literals
```javascript
// Ejemplo en WeatherAlerts.js
const html = alertas.map(alerta => `
    <div class="alert ${alerta.clase}">
        <h5>${alerta.titulo}</h5>
        <p>${alerta.mensaje}</p>
    </div>
`).join('');
```

#### c) Async/Await
```javascript
// Ejemplo en WeatherApp.js
async cargarDatosClima() {
    for (const lugar of this.lugares) {
        const datos = await this.apiClient.obtenerDatosClima(...);
        // ...
    }
}
```

#### d) Parámetros por Defecto
```javascript
// Ejemplo en WeatherAlerts.js
constructor(config = {}) {
    const { umbralCalor = 25, umbralDiasLluvia = 4 } = config;
}
```

---

### 4. CONSUMO DE API (2-3 min)
**Qué decir:**
- "La aplicación consume datos reales de Open-Meteo API"
- "Implementé manejo de rate limiting para evitar errores 429"

**Qué mostrar:**

#### a) Petición a la API
- Abrir consola del navegador (F12)
- Mostrar las peticiones en la pestaña "Network"
- Mostrar los datos JSON recibidos

#### b) Transformación de Datos
- Mostrar código de `ApiClient.obtenerDatosClima()` (líneas 55-81)
- Explicar cómo se transforma la respuesta de la API al formato interno

#### c) Manejo de Errores
- Mostrar código de manejo de 429 (líneas 49-64 en ApiClient.js)
- Explicar el sistema de peticiones secuenciales con delay

---

### 5. FUNCIONALIDADES (3-4 min)
**Demostración en vivo:**

#### a) Vista Home
- Mostrar las tarjetas de ciudades con datos reales
- Explicar que la temperatura y estado vienen de la API

#### b) Vista Detalle
1. **Click en una ciudad** → mostrar detalle
2. **Pronóstico semanal**: Explicar que viene de `daily` de la API
3. **Estadísticas de la semana**:
   - Mostrar las tarjetas de mín/máx/promedio
   - Explicar que se calculan desde datos de la API usando `EstadisticasCalculator`
   - Mostrar el conteo de días por tipo de clima
4. **Alertas de clima**:
   - Si hay alertas, explicar las reglas
   - Si no hay, explicar cuándo aparecerían (ej: si promedio > 25°C)

#### c) Vista de Estadísticas
- Navegar a "Estadísticas" desde el menú
- Mostrar el gráfico de temperaturas
- Explicar que usa datos de la API

#### d) Gráfico de Isoterma (si aplica)
- Navegar a "Torres del Paine"
- Mostrar el gráfico de isoterma 0°C
- Explicar que ahora usa datos dinámicos de la API (no valores fijos)

---

### 6. CÓMO SE CALCULAN LAS ESTADÍSTICAS (2 min)
**Qué explicar:**
- "Las estadísticas se calculan desde los datos `daily` de la API"
- "La clase `EstadisticasCalculator` procesa los arrays de temperaturas"

**Mostrar código:**
```javascript
// EstadisticasCalculator.js
calcularEstadisticas(dailyData) {
    const tempsMax = dailyData.temperature_2m_max;
    const tempsMin = dailyData.temperature_2m_min;
    
    const tempMinima = Math.min(...tempsMin);
    const tempMaxima = Math.max(...tempsMax);
    const tempPromedio = (promedioMin + promedioMax) / 2;
    
    // Conteo de días por tipo de clima
    const diasPorEstado = this._contarDiasPorTipoClima(weatherCodes);
}
```

**Explicar:**
- Se extraen arrays de temperaturas máximas y mínimas
- Se calcula mínimo, máximo y promedio
- Se cuentan los días por tipo de clima según códigos WMO

---

### 7. SISTEMA DE ALERTAS (1-2 min)
**Qué explicar:**
- "Implementé un sistema de alertas basado en reglas simples"

**Reglas a mencionar:**
1. **Alerta de calor**: Si temperatura promedio > 25°C
2. **Semana lluviosa**: Si hay ≥ 4 días de lluvia
3. **Frío extremo**: Si temperatura mínima < -5°C
4. **Viento fuerte**: Si ráfagas > 60 km/h

**Mostrar código:**
- `WeatherAlerts.generarAlertas()` (líneas 20-60)
- Explicar cómo se evalúan las condiciones

---

### 8. MEJORAS Y DIFERENCIAS CON MÓDULO 4 (1 min)
**Qué mencionar:**
- "En el Módulo 4, los datos eran estáticos. Ahora vienen de la API"
- "Las estadísticas se calculan desde datos reales, no desde datos hardcodeados"
- "Agregué un sistema de alertas que no existía antes"
- "El código está mejor organizado usando POO"

---

## 🎯 PREGUNTAS FRECUENTES Y RESPUESTAS

### P: "¿Por qué usaste clases en lugar de funciones?"
**R:** "Para seguir principios de POO: encapsulación, separación de responsabilidades y reutilización. Cada clase tiene una responsabilidad específica."

### P: "¿Cómo manejas los errores de la API?"
**R:** "Implementé try/catch en todas las funciones async, manejo específico para errores 429 (rate limiting) con reintento, y mensajes de error en la interfaz."

### P: "¿Qué pasa si la API no responde?"
**R:** "La aplicación muestra un mensaje de error al usuario. También tengo un sistema de caché que guarda datos por 12 horas, así que si la API falla, puede usar datos recientes."

### P: "¿Cómo se calculan las estadísticas?"
**R:** "La clase `EstadisticasCalculator` recibe los datos diarios de la API, extrae los arrays de temperaturas, calcula mínimo/máximo/promedio usando métodos de JavaScript, y cuenta los días por tipo de clima según los códigos meteorológicos WMO."

### P: "¿Por qué peticiones secuenciales y no en paralelo?"
**R:** "Para evitar el rate limiting de la API. Open-Meteo tiene límites de peticiones por minuto, así que hago las peticiones una por una con un delay de 500ms entre cada una."

---

## 📝 CHECKLIST PRE-PRESENTACIÓN

Antes de presentar, verifica:

- [ ] La aplicación está ejecutándose sin errores
- [ ] Los datos de la API se están cargando correctamente
- [ ] Tienes abiertos los archivos de código que vas a mostrar
- [ ] La consola del navegador está lista (F12)
- [ ] Tienes el README.md abierto para mostrar la documentación
- [ ] Sabes explicar cada clase y su responsabilidad
- [ ] Tienes ejemplos de código preparados

---

## 💡 TIPS PARA UNA BUENA PRESENTACIÓN

1. **Empieza con el resultado**: Muestra la app funcionando primero
2. **Luego explica el código**: Después de mostrar funcionalidades, explica cómo está implementado
3. **Usa la consola**: Muestra las peticiones a la API en tiempo real
4. **Sé específico**: En lugar de "usé POO", di "creé 4 clases: WeatherApp, ApiClient, EstadisticasCalculator y WeatherAlerts"
5. **Muestra código real**: Abre los archivos y muestra fragmentos específicos
6. **Explica el "por qué"**: No solo qué hiciste, sino por qué lo hiciste así

---

## 🎬 ORDEN SUGERIDO DE DEMOSTRACIÓN

1. **Abrir la app** → Mostrar Home con ciudades
2. **Click en una ciudad** → Mostrar detalle con estadísticas y alertas
3. **Abrir código** → Mostrar estructura de clases
4. **Mostrar ApiClient** → Explicar async/await y fetch
5. **Mostrar EstadisticasCalculator** → Explicar cálculos
6. **Mostrar WeatherAlerts** → Explicar reglas
7. **Abrir consola** → Mostrar peticiones a la API
8. **Mostrar README** → Explicar documentación

---

**¡Éxito con tu presentación! 🚀**
