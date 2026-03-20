# 04 — Mapa código ↔ requisitos (Módulo 7)

Rutas relativas a la **raíz del repositorio** (`modulo7_portafolio/`).

## Entrada y configuración

| Archivo | Contenido relevante M7 |
|---------|-------------------------|
| `src/main.js` | `app.use(store)`, `app.use(router)`, `mount` |
| `vite.config.js` | Alias `@`, `@store`, `@services`; puerto dev |
| `index.html` | Punto de montaje `#app`, carga de `src/main.js` |

## Vuex (auth + preferencias + favoritos)

| Archivo | Descripción |
|---------|-------------|
| `src/store/index.js` | Store: `state`, `getters`, `mutations`, `actions`, persistencia `localStorage` |

## Autenticación mock

| Archivo | Descripción |
|---------|-------------|
| `src/services/authService.js` | Login/registro simulados; usuarios demo + registro en `localStorage` |

## Router y rutas protegidas

| Archivo | Descripción |
|---------|-------------|
| `src/router/index.js` | Rutas, `meta.requiresAuth`, `meta.guestOnly`, `beforeEach`, redirect login |

## Vistas M7

| Archivo | Ruta |
|---------|------|
| `src/views/Login.vue` | `/login` |
| `src/views/Registro.vue` | `/registro` |
| `src/views/Favoritos.vue` | `/favoritos` |
| `src/views/PreferenciasClima.vue` | `/preferencias-clima` |
| `src/views/Home.vue` | `/` (tarjetas + favoritos en `PlaceCard`) |
| `src/views/LugarDetalle.vue` | `/lugar/:id` (botón favorito) |

## Componentes / shell

| Archivo | Descripción |
|---------|-------------|
| `src/App.vue` | Navbar: usuario, logout, enlaces; °C/°F y tema desde Vuex |

## Documentación de usuario

| Archivo | Uso |
|---------|-----|
| `README.md` | Descripción, rutas auth, GitHub, `npm run dev` |
| `MODULO7_ENTREGA/` | Esta carpeta: requisitos y dependencias |
