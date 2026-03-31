# ClimaTorre - Torres del Paine Weather App

**Módulo 5 - Portafolio de Desarrollo Frontend (POO + ES6+)**

Aplicación web de pronóstico meteorológico para Torres del Paine y áreas circundantes de la Patagonia chilena y argentina. Reestructurada utilizando Programación Orientada a Objetos y funcionalidades modernas de JavaScript ES6+.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![SASS](https://img.shields.io/badge/SASS-CC6699?style=flat&logo=sass&logoColor=white)](https://sass-lang.com/)

---

##  Descripción del Proyecto

ClimaTorre es una aplicación meteorológica avanzada que muestra el pronóstico de 7 días para 10 ubicaciones estratégicas alrededor del Parque Nacional Torres del Paine.

¡CON DATOS EN TIEMPO REAL!
La aplicación se conecta directamente a la API de Open-Meteo para ofrecer datos precisos y actualizados al instante.

### Ubicaciones Cubiertas:
- **Torres del Paine - Glaciar Grey** (punto de referencia principal)
- Puerto Natales, Punta Arenas (Chile)
- El Calafate, El Chaltén, Glaciar Perito Moreno, Río Gallegos, Tres Lagos, Gobernador Gregores (Argentina)
- Villa O'Higgins (zona norte)

### Temática
La aplicación se centra en **condiciones climáticas de montaña y glaciares**, proporcionando información para excursionistas, montañistas y turistas que visitan la región patagónica.

---

## Funcionalidades

Esta versión incluye características avanzadas:

### 1. Datos en Tiempo Real (API Integration)
- Conexión directa con **Open-Meteo API**.
- **Actualización Automática:** El sistema verifica y actualiza los datos automáticamente a las **08:00 AM** y **08:00 PM** (20:00 hrs) todos los días.
- **Caché Inteligente:** Los datos se guardan localmente para una carga instantánea y funcionamiento offline.

### 2. 📊 Dashboard de Estadísticas
- **Gráficos Interactivos:** Implementación de **Chart.js**.
- **Pestañas por Ciudad:** Navegación fluida entre las 10 estaciones.
- **Pronóstico Visual:** Gráfico de líneas comparativo de temperaturas Máximas y Mínimas para los próximos 7 días.

### 3. ⚠️ Sistema de Alertas Inteligentes
- **Detección de Riesgos:** Análisis automático de condiciones peligrosas.
- **Alertas de Viento:** Advertencias visuales para vientos >40 km/h y >60 km/h (crítico en la Patagonia).
- **Alertas de Nieve y Tormentas:** Notificaciones inmediatas sobre condiciones adversas.

### 4. 📊 Funcionalidades Avanzadas (Módulo 5)
- **Datos Horarios:** Pronóstico hora por hora con 11 variables meteorológicas (temperatura, precipitación, viento, presión, nubes, etc.)
- **Múltiples Modelos Meteorológicos:** Comparación de 3 modelos (ECMWF, GFS, ICON) para mayor precisión
- **Datos Históricos:** Análisis de tendencias con datos de los últimos 5-7 días
- **Gráficos Dinámicos:** Visualización de datos horarios y tendencias históricas vs pronóstico

### 5. 🗺️ Mapas Interactivos Mejorados
- **Mapa Principal con Capa de Viento:**
  - Visualización de viento con flechas direccionales desde cada ciudad
  - Colores según velocidad: Verde (suave), Amarillo (moderado), Naranja (fuerte), Rojo (muy fuerte)
  - Control de capas para activar/desactivar visualización
  - Leyenda interactiva con información de velocidades
  - Tooltips con detalles al pasar el mouse sobre marcadores

- **Mapa Detallado de Torres del Paine:**
  - Mapa topográfico (OpenTopoMap) para mejor visualización de montañas
  - Polígono azul semi-transparente que delimita el área del Parque Nacional
  - Marcadores expandidos con información detallada al hacer clic:
    - Temperatura actual y sensación térmica
    - Humedad, viento, precipitación
    - Pronóstico de próximos días
    - Estadísticas semanales
    - Coordenadas geográficas
  - Leyenda explicativa del área del parque

### 6. 📈 Visualizaciones Avanzadas
- **Gráfico Horario:** Pronóstico de temperatura y precipitación para las próximas 24 horas
- **Gráfico Histórico:** Comparación de datos históricos (últimos 5 días) vs pronóstico futuro
- **Comparación de Modelos:** Visualización de diferencias entre modelos meteorológicos cuando están disponibles

---

## 🎯 Objetivos de Aprendizaje

### Módulo 2
- ✅ HTML5 semántico y estructura limpia
- ✅ Bootstrap para diseño responsive
- ✅ JavaScript básico con DOM manipulation
- ✅ Uso de `addEventListener` para navegación (sin `onclick` inline)
- ✅ Modificación dinámica de clases CSS según ubicación

### Módulo 3
1. ✅ **Metodología de organización de estilos (BEM)**
2. ✅ **Preprocesamiento con SASS** (variables, mixins, parciales, anidamiento)
3. ✅ **Modelo de cajas y conceptos de layout** (posicionamiento, flexbox, grid)
4. ✅ **Bootstrap 4** para sistema de grid y componentes
5. ✅ **Gestión Git/GitHub** con commits descriptivos
6. ✅ **Consumo de APIs REST** y manejo de asincronía (Async/Await)
7. ✅ **Visualización de Datos** con librerías de terceros (Chart.js)

### Módulo 4
1. ✅ **Modelado de datos**: Arreglo de lugares con estructura completa
2. ✅ **Variables y constantes**: Uso para cálculos intermedios
3. ✅ **Ciclos (for/while)**: Recorrido de pronóstico semanal
4. ✅ **Condicionales (if/else)**: Evaluación de estados y generación de resúmenes
5. ✅ **Funciones**: `buscarLugar()` y `calcularEstadisticas()`
6. ✅ **Cálculos estadísticos**: Mínimo, máximo, promedio de temperaturas
7. ✅ **Conteo de días**: Por tipo de clima (Soleado, Nublado, Lluvioso)
8. ✅ **Resumen textual**: Generación automática basada en condiciones

### Módulo 5
1. ✅ **Programación Orientada a Objetos (POO)**: Clases principales (WeatherApp, ApiClient, EstadisticasCalculator, WeatherAlerts)
2. ✅ **ES6+ Features**: let/const, arrow functions, template literals, default parameters
3. ✅ **Programación asíncrona**: Fetch API con async/await para consumo de Open-Meteo API
4. ✅ **Gestión de datos**: Obtención de datos desde API externa, procesamiento JSON
5. ✅ **Estadísticas desde API**: Cálculo de estadísticas semanales a partir de datos reales
6. ✅ **Sistema de alertas**: Alertas meteorológicas basadas en reglas simples (calor, lluvia, frío, viento)
7. ✅ **Organización de código**: Módulos lógicos, clases reutilizables, separación de responsabilidades

---

## 🏗️ Arquitectura de Clases (POO)

### Estructura de Clases

La aplicación utiliza Programación Orientada a Objetos para organizar la lógica de negocio en clases especializadas:

#### 1. **ApiClient** (`js/classes/ApiClient.js`)
Clase encargada de gestionar todas las peticiones a la API Open-Meteo.
- **Responsabilidades**:
  - Construcción de URLs y parámetros de petición
  - Consumo de la API mediante Fetch API
  - Transformación de datos de la API al formato interno
  - Gestión de caché local (Map)

**Métodos principales**:
- `obtenerDatosClima(cityName, coords)` - Obtiene datos para una ciudad específica
- `obtenerDatosMultiples(ciudades)` - Obtiene datos para múltiples ciudades en paralelo
- `obtenerDeCache(key)` / `guardarEnCache(key, data)` - Gestión de caché

#### 2. **WeatherApp** (`js/classes/WeatherApp.js`)
Clase principal de la aplicación que orquesta todas las funcionalidades.
- **Responsabilidades**:
  - Gestión de lugares y configuración
  - Coordinación de peticiones a la API
  - Cálculo de estadísticas y generación de alertas
  - Transformación de códigos meteorológicos WMO a descripciones e iconos

**Métodos principales**:
- `cargarLugares(configCiudades)` - Carga configuración de ciudades
- `cargarDatosClima()` - Obtiene datos meteorológicos desde la API
- `cargarDetalleLugar(nombreLugar)` - Carga detalle de un lugar específico
- `calcularEstadisticas(nombreLugar)` - Calcula estadísticas semanales
- `obtenerAlertas(nombreLugar)` - Genera alertas meteorológicas

#### 3. **EstadisticasCalculator** (`js/classes/EstadisticasCalculator.js`)
Clase especializada en cálculos estadísticos a partir de datos de pronóstico.
- **Responsabilidades**:
  - Cálculo de temperaturas mínima, máxima y promedio
  - Conteo de días por tipo de clima
  - Generación de resúmenes textuales

**Métodos principales**:
- `calcularEstadisticas(dailyData)` - Calcula todas las estadísticas semanales
- `generarResumen(estadisticas)` - Genera resumen textual basado en estadísticas

#### 4. **WeatherAlerts** (`js/classes/WeatherAlerts.js`)
Clase encargada de generar alertas meteorológicas basadas en reglas simples.
- **Responsabilidades**:
  - Evaluación de condiciones meteorológicas
  - Generación de alertas según umbrales configurados
  - Renderizado de alertas en HTML

**Reglas de alertas**:
- **Alerta de calor**: Temperatura promedio > 25°C
- **Semana lluviosa**: ≥ 4 días de lluvia
- **Frío extremo**: Temperatura mínima < -5°C
- **Viento fuerte**: Ráfagas > 60 km/h

**Métodos principales**:
- `generarAlertas(estadisticas, dailyData)` - Genera array de alertas
- `renderizarAlertas(alertas)` - Genera HTML para mostrar alertas

### Diagrama de Dependencias

```
WeatherApp
├── ApiClient (consume)
├── EstadisticasCalculator (utiliza)
└── WeatherAlerts (utiliza)
```

---

## 🏗️ Metodología de Estilos: BEM

### ¿Qué es BEM?

**BEM** (Block Element Modifier) es una convención de nomenclatura para clases CSS que facilita el mantenimiento y escalabilidad del código.

### Estructura BEM

```
.bloque__elemento--modificador
```

- **Bloque**: Componente independiente (ej: `place-card`)
- **Elemento**: Parte del bloque (ej: `place-card__header`)
- **Modificador**: Variante del bloque/elemento (ej: `place-card--sunny`)

### Ejemplos en ClimaTorre

#### Componente: Tarjeta de Lugar
```html
<article class="place-card place-card--sunny">
    <div class="place-card__header">
        <h2 class="place-card__name">El Calafate</h2>
        <span class="place-card__distance">290 km</span>
    </div>
    <div class="place-card__body">
        <div class="place-card__icon">...</div>
        <div class="place-card__temp">13°C</div>
        <div class="place-card__description">...</div>
        <span class="place-card__badge">Ver detalle</span>
    </div>
</article>
```

**Modificadores de clima:**
- `.place-card--sunny` (soleado)
- `.place-card--rainy` (lluvioso)
- `.place-card--snowy` (nevado)
- `.place-card--cloudy` (nublado)

---

## 📡 API de Clima Utilizada

### Open-Meteo API

**URL Base**: `https://api.open-meteo.com/v1/forecast`

**Documentación**: [https://open-meteo.com/](https://open-meteo.com/)

#### Características
- **Gratuita y sin API Key requerida**
- **Datos en tiempo real** para pronóstico meteorológico
- **Cobertura global** con datos históricos y pronóstico
- **Formato JSON** fácil de procesar

#### Endpoint Utilizado

**Endpoint básico:**
```
GET https://api.open-meteo.com/v1/forecast?
  latitude={lat}&
  longitude={lon}&
  current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&
  daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&
  timezone=America/Santiago&
  forecast_days=7
```

**Endpoint con funcionalidades avanzadas (opcional):**
```
GET https://api.open-meteo.com/v1/forecast?
  latitude={lat}&
  longitude={lon}&
  current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&
  hourly=temperature_2m,precipitation_probability,snowfall,pressure_msl,wind_speed_10m,wind_gusts_10m,precipitation,cloud_cover_low,cloud_cover_mid,cloud_cover_high,weather_code&
  daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&
  models=ecmwf_ifs025,gfs_graphcast025,icon_global&
  past_days=5&
  timezone=America/Santiago&
  forecast_days=7
```

#### Parámetros
- `latitude` / `longitude`: Coordenadas geográficas
- `current`: Variables meteorológicas actuales
- `daily`: Variables meteorológicas diarias (pronóstico 7 días)
- `hourly`: Variables meteorológicas horarias (opcional, 11 variables disponibles)
- `models`: Modelos meteorológicos múltiples (opcional: ECMWF, GFS, ICON)
- `past_days`: Días históricos a incluir (opcional, por defecto 5)
- `timezone`: Zona horaria (America/Santiago para Chile)
- `forecast_days`: Días de pronóstico (7 días)

#### Códigos Meteorológicos WMO
La API utiliza códigos meteorológicos WMO (World Meteorological Organization):
- `0-3`: Despejado a nublado
- `45-48`: Niebla
- `51-67`: Precipitación (llovizna/lluvia)
- `71-86`: Nieve
- `80-82`: Chubascos
- `95-99`: Tormentas

#### Ejemplo de Respuesta

```json
{
  "current": {
    "time": "2025-01-20T12:00",
    "temperature_2m": 15.3,
    "weather_code": 61,
    "wind_speed_10m": 25.5,
    "wind_direction_10m": 180
  },
  "daily": {
    "time": ["2025-01-20", "2025-01-21", ...],
    "temperature_2m_max": [18.5, 16.2, ...],
    "temperature_2m_min": [8.1, 6.5, ...],
    "weather_code": [61, 63, ...],
    "precipitation_sum": [5.2, 8.1, ...]
  }
}
```

#### Cómo se Calculan las Estadísticas

Las estadísticas semanales se calculan a partir de los datos diarios (`daily`) de la API:

1. **Temperatura Mínima**: Valor mínimo de `temperature_2m_min` en el rango de pronóstico
2. **Temperatura Máxima**: Valor máximo de `temperature_2m_max` en el rango de pronóstico
3. **Temperatura Promedio**: Promedio aritmético de todas las temperaturas máximas y mínimas
4. **Días por Tipo de Clima**: Conteo según `weather_code` transformado a tipos (Soleado, Nublado, Lluvioso, Nevado)
5. **Resumen Semanal**: Generación automática de texto descriptivo basado en las estadísticas

La clase `EstadisticasCalculator` se encarga de procesar estos datos y generar las estadísticas.

#### Datos Horarios

Cuando se habilita `includeHourly: true`, se obtienen 11 variables meteorológicas por hora:
- Temperatura a 2m
- Probabilidad de precipitación
- Nieve
- Presión atmosférica
- Velocidad del viento y ráfagas
- Precipitación
- Cobertura de nubes (baja, media, alta)
- Código meteorológico

Estos datos se utilizan para:
- Gráficos de pronóstico horario (próximas 24 horas)
- Análisis detallado de condiciones meteorológicas
- Visualización de tendencias hora por hora

#### Múltiples Modelos Meteorológicos

Cuando se habilita `includeModels: true`, se obtienen datos de 3 modelos diferentes:
- **ECMWF IFS025**: Modelo europeo (Centro Europeo de Pronósticos Meteorológicos)
- **GFS GraphCast025**: Modelo estadounidense (Global Forecast System)
- **ICON Global**: Modelo alemán (Icosahedral Nonhydrostatic)

La aplicación compara estos modelos y detecta diferencias significativas (>2°C) para alertar al usuario sobre posibles variaciones en el pronóstico.

---

## 📁 Estructura SASS

### Organización de Archivos

```
scss/
├── base/
│   ├── _variables.scss    # Variables de diseño (colores, fuentes, spacing)
│   ├── _mixins.scss        # Mixins reutilizables (media queries, flexbox)
│   └── _reset.scss         # Reset CSS y box-sizing
├── layout/
│   └── _layout.scss        # Estructura principal (header, main, footer)
├── components/
│   ├── _navbar.scss        # Barra de navegación
│   ├── _place-card.scss    # Tarjetas de ubicaciones
│   ├── _buttons.scss       # Botones
│   └── _footer.scss        # Pie de página
└── main.scss               # Archivo principal que importa todos los parciales
```

---

## 🚀 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos compilados desde SASS
- **SASS** - Preprocesador CSS
- **Bootstrap 4.6.2** - Sistema de grid y componentes
- **JavaScript (ES6+)** - Lógica de aplicación con POO
- **Leaflet.js** - Mapas interactivos
  - **OpenTopoMap** - Mapas topográficos para visualización de montañas
  - **OpenStreetMap** - Mapas base
- **Chart.js** - Gráficos y visualización de datos
- **Font Awesome 6** - Iconografía
- **Open-Meteo API** - Fuente de datos meteorológicos
  - Datos actuales, diarios y horarios
  - Múltiples modelos meteorológicos
  - Datos históricos

---

## 📦 Instalación y Uso

### Requisitos Previos
- Node.js (v14 o superior)
- npm (v6 o superior)

### Pasos de Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/usuario/weather-frontend-m3.git
cd weather-frontend-m3
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Compilar SASS**:
```bash
npm run build-css
```

4. **Modo desarrollo (watch)**:
```bash
npm run watch-css
```

5. **Abrir en el navegador**:
Abre `index.html` directamente o usa un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

Luego navega a `http://localhost:8000`

---

## 🎨 Responsive Design

### Breakpoints

| Dispositivo | Ancho | Columnas Grid |
|-------------|-------|---------------|
| **Mobile** | ≤ 420px | 1 columna (`col-12`) |
| **Tablet** | ≥ 768px | 2 columnas (`col-md-6`) |
| **Desktop** | ≥ 1024px | 3-4 columnas (`col-lg-4 col-xl-3`) |

---

## 📊 Estructura del Proyecto

```
modulo5_portafolio/
├── index.html              # Página principal (HTML5 semántico)
├── package.json            # Configuración npm
├── README.md               # Este archivo
├── CHANGELOG.md            # Historial de cambios
├── scss/                   # Código fuente SASS
│   ├── base/
│   │   ├── _variables.scss    # Variables de diseño
│   │   ├── _mixins.scss        # Mixins reutilizables
│   │   └── _reset.scss         # Reset CSS
│   ├── layout/
│   │   └── _layout.scss        # Estructura principal
│   ├── components/
│   │   ├── _navbar.scss        # Barra de navegación
│   │   ├── _place-card.scss    # Tarjetas de ubicaciones
│   │   ├── _buttons.scss       # Botones
│   │   ├── _footer.scss        # Pie de página
│   │   ├── _theme.scss         # Estilos de tema claro/oscuro
│   │   └── _inline-styles.scss # Estilos movidos desde HTML
│   └── main.scss               # Archivo principal
├── css/
│   └── main.css            # CSS compilado (generado)
├── js/
│   ├── classes/            # Clases POO (Módulo 5)
│   │   ├── ApiClient.js              # Cliente para API Open-Meteo
│   │   ├── WeatherApp.js              # Clase principal de la aplicación
│   │   ├── EstadisticasCalculator.js  # Cálculo de estadísticas
│   │   └── WeatherAlerts.js          # Generación de alertas
│   ├── config/            # Archivos de configuración
│   │   ├── constants.js              # Constantes de la aplicación
│   │   └── ciudades.js               # Configuración de ciudades
│   │   ├── ApiClient.js        # Cliente para API Open-Meteo
│   │   ├── WeatherApp.js       # Clase principal de la aplicación
│   │   ├── EstadisticasCalculator.js # Calculadora de estadísticas
│   │   └── WeatherAlerts.js    # Generador de alertas meteorológicas
│   ├── config/
│   │   ├── constants.js        # Constantes de configuración
│   │   └── ciudades.js         # Configuración de ciudades
│   ├── services/           # Servicios (Módulo 4)
│   │   ├── LugarService.js
│   │   └── EstadisticasService.js
│   ├── utils/
│   │   ├── excursionista.js    # Utilidades para excursionistas
│   │   ├── mathUtils.js        # Utilidades matemáticas
│   │   └── validators.js       # Validadores
│   ├── app.js              # Lógica principal (refactorizado)
│   ├── navigation.js       # Event listeners de navegación
│   ├── theme.js            # Gestor de tema claro/oscuro
│   ├── weatherService.js   # Servicio de datos (compatibilidad)
│   └── lugares.js          # Datos estáticos Módulo 4
└── assets/                 # Recursos adicionales
```

---

## 🔮 Próximas Mejoras (Roadmap)

### ✅ Completadas (Módulo 5)
- [x] Integración con **Open-Meteo API** para datos en tiempo real
- [x] Gráficos de tendencia de temperatura (Chart.js)
- [x] Sistema de Alertas Meteorológicas
- [x] Modo oscuro/claro
- [x] Variables meteorológicas para excursionistas
- [x] Reestructuración de código con POO y ES6+
- [x] **Datos horarios** con 11 variables meteorológicas
- [x] **Múltiples modelos meteorológicos** (ECMWF, GFS, ICON)
- [x] **Datos históricos** (últimos 5-7 días)
- [x] **Gráficos dinámicos** de datos horarios e históricos
- [x] **Capa de viento** en mapa principal con visualización interactiva
- [x] **Mapa topográfico** de Torres del Paine con área identificada
- [x] **Popups expandidos** en marcadores con información detallada

### 🚀 Próximas Funcionalidades
- [ ] Búsqueda de ubicaciones personalizadas
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push para alertas críticas
- [ ] Exportación de datos meteorológicos (CSV/JSON)
- [ ] Comparación de condiciones entre diferentes fechas
- [ ] Alertas personalizadas por usuario

---

## 📝 Git & GitHub

### Commits Realizados

✅ **Commits descriptivos siguiendo Conventional Commits:**

#### Módulo 3
1. `chore: setup sass structure and npm configuration`
2. `style: apply BEM methodology to weather cards and layout`
3. `feat: integrate Bootstrap 4 grid and responsive design`
4. `docs: add comprehensive README with methodology explanation`
5. `feat: implement real-time data fetching from Open-Meteo API`
6. `feat: add statistics dashboard and weather alerts`

#### Módulo 4
7. `feat: add dark/light theme toggle with persistence`
8. `refactor: move all scripts to external files (separation of concerns)`
9. `feat: add excursionist-focused weather variables to Torres cards`
10. `fix: ensure uniform card heights in grid layout`
11. `feat: implement Module 4 requirements (data modeling, statistics)`
12. `docs: update README and add CHANGELOG`

#### Módulo 5
13. `feat: implement POO architecture with ES6+ classes (ApiClient, WeatherApp, EstadisticasCalculator, WeatherAlerts)`
14. `refactor: migrate app.js to use OOP classes and async/await`
15. `feat: add weather alerts system based on simple rules (heat, rain, cold, wind)`
16. `feat: integrate statistics calculation from API data`
17. `docs: update README with class structure and API documentation`

### Convención de Commits

Siguiendo **Conventional Commits**:
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `style:` - Cambios de estilos (CSS/SASS)
- `refactor:` - Refactorización de código
- `docs:` - Documentación
- `chore:` - Tareas de mantenimiento

---

## 👤 Autor

**Nombre**: [Tu Nombre]  
**Curso**: Desarrollo Frontend - Módulo 4  
**Institución**: AIEP  
**Año**: 2025

---

## 📜 Licencia

ISC License - Este proyecto es de uso educativo.

---

## 📚 Documentación Adicional

El proyecto incluye documentación adicional en los siguientes archivos:

- **`EJEMPLOS_USO_AVANZADO.md`**: Guía completa de uso de funcionalidades avanzadas (datos horarios, modelos múltiples, datos históricos)
- **`COMO_PROBAR_MEJORAS.md`**: Instrucciones paso a paso para probar las nuevas funcionalidades
- **`COMPARACION_API.md`**: Comparación entre uso de SDK vs Fetch API directo
- **`CHECKLIST_ENTREGA_M5.md`**: Checklist completo para entrega del Módulo 5
- **`GUIA_PRESENTACION_M5.md`**: Guía para presentación del proyecto

### Uso Rápido de Funcionalidades Avanzadas

**Datos Horarios (ya activo por defecto):**
- Se muestran automáticamente en la vista de detalle de cada ciudad
- Gráfico de temperatura y precipitación para las próximas 24 horas

**Capa de Viento en el Mapa:**
- Haz clic en el botón "Viento" en la esquina superior derecha del mapa principal
- Verás flechas de viento desde cada ciudad con colores según la velocidad

**Mapa de Torres del Paine:**
- Navega a la sección "Torres del Paine - Pronóstico Detallado"
- Haz clic en cualquier marcador para ver información expandida
- El mapa muestra el área del parque con color identificador azul

**Modelos Múltiples (opcional):**
- Usa la consola del navegador (F12) para activar modelos:
```javascript
weatherApp.cargarDetalleLugar('Torres del Paine - Glaciar Grey', {
    includeModels: true
}).then(() => {
    showDetail('Torres del Paine - Glaciar Grey');
});
```

---

## 🔗 Enlaces

- **Repositorio GitHub**: [https://github.com/miguellucero123/weather-frontend-m3](https://github.com/miguellucero123/weather-frontend-m3)
- **Open-Meteo API**: [https://open-meteo.com/](https://open-meteo.com/)
- **OpenTopoMap**: [https://opentopomap.org/](https://opentopomap.org/)
- **BEM Methodology**: [https://getbem.com/](https://getbem.com/)
- **SASS Documentation**: [https://sass-lang.com/](https://sass-lang.com/)
- **Bootstrap 4 Docs**: [https://getbootstrap.com/docs/4.6/](https://getbootstrap.com/docs/4.6/)
- **Chart.js**: [https://www.chartjs.org/](https://www.chartjs.org/)
- **Leaflet.js**: [https://leafletjs.com/](https://leafletjs.com/)

---

## 🙏 Agradecimientos

- Datos meteorológicos de **Open-Meteo API**
- Mapas proporcionados por **OpenStreetMap**, **OpenTopoMap** y **Leaflet.js**
- Iconos de **Font Awesome**
- Gráficos por **Chart.js**
- Modelos meteorológicos de **ECMWF**, **GFS** y **ICON**

---

**¡Gracias por revisar este proyecto!** 🌤️
