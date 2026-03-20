# ClimaTorre

Aplicación web de tipo SPA (Single Page Application) para consulta de información meteorológica en Torres del Paine (circuitos W y O). El módulo actual incorpora autenticación, gestión de estado global con Vuex y rutas condicionadas por sesión.

## Alcance

| Área | Descripción |
|------|-------------|
| Front-end | Vue 3, Vue Router 4, Vuex 4 |
| Datos climáticos | API Open-Meteo (coordenadas por lugar) |
| Autenticación | Simulación en cliente (`src/services/authService.js`); sin backend obligatorio |

## Modelo de usuario y persistencia

El estado de autenticación y las preferencias se gestionan en Vuex (`src/store/index.js`). La persistencia en navegador utiliza las claves indicadas en la tabla siguiente.

| Campo en el estado | Contenido |
|--------------------|-----------|
| Identidad | `id`, `nombre`, `email` (sin contraseña en memoria de aplicación) |
| Favoritos | `favoriteIds` (identificadores numéricos de lugares) |
| Preferencias | `tempUnit` (Celsius o Fahrenheit), `theme` (claro u oscuro) |

| Clave `localStorage` | Uso |
|----------------------|-----|
| `climatorre_vuex_session` | Sesión de usuario autenticado |
| `climatorre_guest_*` / `tempUnit` / `theme` | Preferencias de invitado y compatibilidad |

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
git clone <URL_DEL_REPOSITORIO>
cd modulo7_portafolio
npm install
```

Sustituya `<URL_DEL_REPOSITORIO>` por la URL del repositorio público correspondiente a su entrega.

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

## Stack tecnológico

| Componente | Versión declarada (referencia) |
|------------|--------------------------------|
| Vue | 3.x |
| Vue Router | 4.x |
| Vuex | 4.x |
| Vite | 5.x |
| Iconografía | Lucide Vue Next |
| Estilos | CSS / SCSS (según rutas del proyecto) |

## Repositorio público

Actualice el siguiente enlace con el repositorio GitHub oficial de la entrega:

`https://github.com/miguellucero123/portafolio_modulo6`

## Documentación complementaria

La carpeta `MODULO7_ENTREGA/` contiene la matriz de requisitos del módulo, el listado de dependencias npm y copias de los manifiestos `package.json` y `package-lock.json` para auditoría o despliegue reproducible.

## Evolución del código (criterio de ingeniería)

Las mejoras propuestas sobre el estado actual se documentan con enfoque de priorización, riesgo y límites respecto a la rúbrica en [`docs/MEJORAS_ENFOQUE_SENIOR.md`](./docs/MEJORAS_ENFOQUE_SENIOR.md). No sustituyen los entregables obligatorios del módulo; sirven como guía para iteraciones posteriores.

## Resolución de incidencias (desarrollo local)

Si otra aplicación en el mismo origen ha registrado un Service Worker en `localhost:5173`, pueden aparecer errores de caché o respuestas inconsistentes. En ese caso: desregistre los Service Workers afectados desde las herramientas de desarrollo del navegador (Application → Service Workers) o utilice una ventana de navegación privada. El uso del puerto 5174 en la configuración de Vite reduce el solapamiento con otros proyectos locales.

---

**Contexto:** proyecto académico — Módulo 7 (autenticación y personalización con Vuex).
