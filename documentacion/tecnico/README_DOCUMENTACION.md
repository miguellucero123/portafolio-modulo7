# ClimaTorre — documentación completa

Guía ampliada del repositorio (antes concentrada en el `README.md` de la raíz). La página principal de GitHub muestra solo [README.md](../../README.md) resumido.

---

Aplicación web de tipo SPA (Single Page Application) para consulta de información meteorológica en Torres del Paine (circuitos W y O). El módulo actual incorpora autenticación, gestión de estado global con Vuex y rutas condicionadas por sesión.

**Verificación frente al enunciado del Módulo 7:** [`RUBRICA_CUMPLIMIENTO.md`](../../RUBRICA_CUMPLIMIENTO.md).

**Portafolio 8 (producto terminado — integra Portafolio 7 + rúbrica final API/Vuex clima, estadísticas, alertas, entregables):** carpeta [`portafolio_8/`](../portafolio_8/README.md) — leer primero [`01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md`](../portafolio_8/01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md); matriz [`RUBRICA_CUMPLIMIENTO_PORTAFOLIO_8.md`](../portafolio_8/RUBRICA_CUMPLIMIENTO_PORTAFOLIO_8.md).

**Entrega en ZIP:** carpeta [`portafolio-m7/`](../portafolio-m7/README.md) (instrucciones y script `scripts/empaquetar-portafolio-m7.ps1`).

**Solo requisitos rúbrica M7 (copia mínima del proyecto):** [`RUBRICA_M7_CONTENIDO/`](../RUBRICA_M7_CONTENIDO/README.md) y script `scripts/extraer-rubrica-m7.ps1` (genera `documentacion/RUBRICA_M7_CONTENIDO/entrega/` sin código legacy ni clones).

**Proyecto 2 (revisión, mejora, feedback y cierre de portafolio):** [`proyecto_2/`](../proyecto_2/README.md).

**Proyecto 3 (portafolio profesional, herramientas digitales y reflexión):** [`proyecto_3/`](../proyecto_3/README.md).

## Alcance

| Área | Descripción |
|------|-------------|
| Front-end | Vue 3, Vue Router 4, Vuex 4 |
| Datos climáticos | API Open-Meteo (coordenadas por lugar) |
| Autenticación | Simulación en cliente (`src/services/authService.js`); sin backend obligatorio |

## Modelo de usuario y persistencia

El estado de autenticación, las preferencias y el **clima** (lista de lugares, carga, errores, lugar seleccionado) se gestionan en Vuex (`src/store/index.js`). La persistencia en navegador utiliza las claves indicadas en la tabla siguiente.

| Campo en el estado | Contenido |
|--------------------|-----------|
| Identidad | `id`, `nombre`, `email` (sin contraseña en memoria de aplicación) |
| Favoritos | `favoriteIds` (identificadores numéricos de lugares) |
| Preferencias | `tempUnit` (Celsius o Fahrenheit), `theme` (claro u oscuro) |
| Clima (API) | `weatherLugares`, `weatherLoading`, `weatherError`, `weatherLastUpdate`, `selectedLugarId` |

| Clave `localStorage` | Uso |
|----------------------|-----|
| `climatorre_vuex_session` | Sesión de usuario autenticado |
| `climatorre_guest_*` / `tempUnit` / `theme` | Preferencias de invitado y compatibilidad |

## Rutas principales (clima y navegación)

| Ruta | Función |
|------|---------|
| `/` | **Home:** listado de lugares con clima actual |
| `/lugar/:id` | **Detalle:** pronóstico por días, estadísticas de la semana, alertas meteorológicas |

## Rutas de autenticación y áreas restringidas

| Ruta | Acceso | Función |
|------|--------|---------|
| `/login` | Público | Formulario de inicio de sesión |
| `/registro` | Público | Registro simulado (persistencia local) |
| `/favoritos` | Autenticado | Listado de lugares marcados como favoritos |
| `/preferencias-clima` | Autenticado | Configuración de unidad térmica y tema visual |

El acceso sin sesión a rutas protegidas provoca redirección a `/login` con el parámetro `redirect` para retornar tras un inicio de sesión válido.

## Credenciales de prueba (entorno demo)

| Usuario | Contraseña |
|---------|------------|
| demo@climatorre.cl | demo123 |
| explorador@example.com | paine2025 |

## Requisitos previos

- Node.js 18 LTS o superior (recomendado)
- npm (incluido con Node.js)

## Instalación

```bash
git clone https://github.com/miguellucero123/portafolio-modulo7.git
cd portafolio-modulo7
npm install
```

Ajuste la URL o el nombre de carpeta si el repositorio o el clon difieren.

## Variables de entorno y API de clima

La aplicación consume **Open-Meteo** mediante **`fetch`** (sin dependencia de Axios) desde `src/services/weatherService.js`. **No se requiere API key** ni archivo `.env` para la configuración por defecto. Si cambia a un proveedor que exija clave, defina las variables en `.env` según ese servicio y documente aquí los nombres de variables y pasos de configuración.

## Ejecución en desarrollo

```bash
npm run dev
```

El servidor de desarrollo Vite queda configurado en el puerto **5174** por defecto (`vite.config.js`). URL local: `http://localhost:5174/`. Si el puerto está ocupado, Vite selecciona el siguiente disponible.

## Compilación y vista previa de producción

```bash
npm run build
npm run preview
```

## Despliegue (Netlify)

El archivo `netlify.toml` define el build (`npm run build`), la publicación desde `dist` y la redirección necesaria para **Vue Router** (modo history). Instrucciones detalladas: [`DEPLOY_NETLIFY.md`](./DEPLOY_NETLIFY.md).

Resumen: conecte el repositorio en [app.netlify.com](https://app.netlify.com), deje que Netlify use la configuración del archivo y despliegue. No requiere cambios de `base` en Vite para un sitio en la raíz del dominio.

## Stack tecnológico

| Componente | Versión declarada (referencia) |
|------------|--------------------------------|
| Vue | 3.x |
| Vue Router | 4.x |
| Vuex | 4.x |
| Vite | 6.x |
| Iconografía | Lucide Vue Next |
| Estilos | CSS / SCSS (según rutas del proyecto) |

## Repositorio público

`https://github.com/miguellucero123/portafolio-modulo7`

## Documentación complementaria

| Recurso | Contenido |
|---------|-----------|
| [`MODULO7_ENTREGA/`](../MODULO7_ENTREGA/README.md) | Matriz de requisitos, dependencias npm, manifiestos |
| [`proyecto_3/`](../proyecto_3/README.md) | Proyecto 3: portafolio profesional, evidencias y reflexión |
| [`portafolio_8/`](../portafolio_8/README.md) | Portafolio 8: cumplimiento rúbrica integrada final |
| [`GITHUB_SETUP_M7.md`](./GITHUB_SETUP_M7.md) | Creación del remoto y primer `push` |

## Resolución de incidencias (desarrollo local)

Si otra aplicación en el mismo origen ha registrado un Service Worker en `localhost:5173`, pueden aparecer errores de caché o respuestas inconsistentes. En ese caso: desregistre los Service Workers afectados desde las herramientas de desarrollo del navegador (Application → Service Workers) o utilice una ventana de navegación privada. El uso del puerto 5174 en la configuración de Vite reduce el solapamiento con otros proyectos locales.

---

**Contexto:** proyecto académico — Módulo 7 (autenticación y personalización con Vuex).
