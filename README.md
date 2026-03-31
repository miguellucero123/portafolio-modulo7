# ClimaTorre

Aplicación web de una sola página (**SPA**) para consulta de información meteorológica en **Torres del Paine** (Chile), con estado global, autenticación simulada en cliente y preferencias de usuario.

---

## Descripción

ClimaTorre integra datos climáticos en tiempo (y pronóstico) mediante **Open-Meteo**, presentados en una interfaz orientada a circuitos y lugares de interés. El proyecto está pensado como portafolio técnico: código mantenible, rutas definidas, gestión de sesión y documentación accesible.

---

## Funcionalidades principales

- Listado y detalle de lugares con condiciones actuales y pronóstico multi-día.
- Estadísticas agregadas y visualización de tendencias en el detalle.
- Autenticación **simulada** en el navegador (sin backend obligatorio).
- Rutas protegidas: favoritos y preferencias de clima (unidad térmica, tema).
- Persistencia de sesión y preferencias vía almacenamiento local.
- Despliegue preparado para **Netlify** (build estático y enrutamiento SPA).

---

## Stack tecnológico

| Área | Tecnología |
|------|------------|
| Framework | Vue 3 (componentes en formato SFC) |
| Enrutamiento | Vue Router 4 |
| Estado | Vuex 4 |
| Build | Vite 6 |
| Estilos | CSS / SCSS (según módulos del proyecto) |
| Iconografía | Lucide Vue Next |
| Datos climáticos | Open-Meteo (HTTP, sin API key en la configuración por defecto) |

---

## Requisitos

- **Node.js** 18 LTS o superior (recomendado).
- **npm** (incluido con Node.js).

---

## Instalación y ejecución en local

```bash
git clone https://github.com/miguellucero123/portafolio-modulo7.git
cd portafolio-modulo7
npm install
npm run dev
```

Por defecto el servidor de desarrollo queda en **http://localhost:5174** (definido en `vite.config.js`). El acceso demo utiliza un **mock de autenticación** en el cliente; no sustituye un sistema de identidad de producción.

---

## Scripts npm

| Comando | Uso |
|---------|-----|
| `npm run dev` | Servidor de desarrollo (Vite). |
| `npm run build` | Compilación para producción (`dist/`). |
| `npm run preview` | Vista previa local del build de producción. |

---

## Datos y configuración

- **Clima:** consumo vía `fetch` contra Open-Meteo; no se requiere archivo `.env` para el flujo estándar.
- **Autenticación:** usuarios de demostración y registro simulado; detalle de implementación en `src/services/authService.js` (solo entornos de desarrollo y prueba).

---

## Organización del repositorio

- **`src/`** — Código fuente de la aplicación (vistas, router, store, servicios, componentes).
- **`public/`** — Activos estáticos y reglas de despliegue donde aplique.
- **`documentacion/`** — Guías técnicas, entregas académico-formativas y material de portafolio.
- **`legacy/`** — Artefactos históricos no utilizados por la SPA actual.

---

## Documentación ampliada

| Contenido | Ubicación |
|-----------|-----------|
| Guía técnica (rutas, Vuex, Netlify, incidencias) | [`documentacion/tecnico/README_DOCUMENTACION.md`](./documentacion/tecnico/README_DOCUMENTACION.md) |
| Cumplimiento rúbrica Módulo 7 | [`RUBRICA_CUMPLIMIENTO.md`](./RUBRICA_CUMPLIMIENTO.md) |
| Producto final y portafolio 8 | [`documentacion/portafolio_8/README.md`](./documentacion/portafolio_8/README.md) |
| Despliegue en Netlify | [`documentacion/tecnico/DEPLOY_NETLIFY.md`](./documentacion/tecnico/DEPLOY_NETLIFY.md) |
| Índice de la carpeta `documentacion/` | [`documentacion/README.md`](./documentacion/README.md) |

---

## Despliegue

La configuración de build y publicación se describe en la documentación de Netlify enlazada arriba. El repositorio incluye `netlify.toml` alineado con **Vue Router** en modo history.

---

## Licencia

Este proyecto se distribuye bajo la licencia **ISC** (véase `package.json`).

---

**Repositorio:** [github.com/miguellucero123/portafolio-modulo7](https://github.com/miguellucero123/portafolio-modulo7)
