# 02 — Requisitos de la rúbrica (Módulo 7)

Referencia al alcance: **SPA Vue**, **Vue Router**, **Vuex**, autenticación simulada o real, rutas protegidas y personalización por usuario.

## Propósito

| Requisito | Cumplimiento en el proyecto |
|-----------|----------------------------|
| Sistema básico de usuarios (registro/login) | Vistas `/login` y `/registro`; servicio mock `src/services/authService.js` |
| Vuex: estado global de autenticación y preferencias | `src/store/index.js` |
| Personalización (favoritos, preferencias clima) | Favoritos en store; `/favoritos`, `/preferencias-clima`; navbar y `App.vue` leen el store |

## Objetivos de aprendizaje

| Objetivo | Evidencia |
|----------|-----------|
| Pantallas registro/login | `src/views/Login.vue`, `src/views/Registro.vue` |
| Vuex para auth y datos de usuario | `src/store/index.js` (state, mutations, actions) |
| Rutas protegidas | `src/router/index.js` (`meta.requiresAuth`, guard `beforeEach`) |
| Interfaz según usuario | Nombre en navbar; favoritos; °C/°F y tema desde `preferences` en Vuex |
| Git/GitHub con commits descriptivos | Historial local + README con enlace (responsabilidad del alumno) |

## Alcance — rutas / vistas

| Ruta | Archivo | Notas |
|------|---------|--------|
| `/login` | `Login.vue` | Formulario; error claro si falla |
| `/registro` | `Registro.vue` | Alta simulada persistida en `localStorage` |
| `/favoritos` | `Favoritos.vue` | **Protegida** |
| `/preferencias-clima` | `PreferenciasClima.vue` | **Protegida** |

## Flujo de autenticación

| Paso | Implementación |
|------|----------------|
| Credenciales | `v-model` + `@submit` en formularios |
| Éxito | `dispatch('login')` / `dispatch('register')` → Vuex → persistencia → redirección (`redirect` query o `lastRoute`) |
| Error | Mensaje tipo *Usuario o contraseña incorrectos* (mock) |

## Requisitos funcionales mínimos

### Login
- Formulario correo + contraseña: **sí** (`Login.vue`).
- Éxito: usuario en Vuex + redirección: **sí** (router + `authService`).
- Error: mensaje claro: **sí**.

### Estado de usuario
- Indicio de sesión (nombre, cerrar sesión): **sí** (`App.vue`).
- Logout limpia Vuex y redirige si ruta protegida: **sí** (`logout` action + `onLogout`).

### Personalización
- Favoritos y preferencias desde **Vuex** (no hardcodeadas como datos de usuario): **sí** (`favoriteIds`, `preferences`).

### Rutas protegidas
- Al menos una ruta privada: **sí** (`/favoritos`, `/preferencias-clima`); redirección a `/login` con `?redirect=`.

## Requisitos técnicos — Vuex

| Elemento | Ubicación |
|----------|-----------|
| `state`: usuario, `isAuthenticated` (vía getter), preferencias, favoritos | `src/store/index.js` |
| `mutations`: login implícito en `SET_USER`, `CLEAR_USER`, preferencias, favoritos | Mismo archivo |
| `actions`: login, register, logout, updatePreferences, toggleFavorite | Mismo archivo |
| Componentes leen el store | `mapState`, `mapGetters`, `mapActions` en `App.vue`, `PlaceCard.vue`, vistas |

## Login / registro — formularios Vue

- `v-model`, `@submit`: **sí** en `Login.vue` y `Registro.vue`.
- Credenciales: mock en front (`authService.js`).

## Router

- Rutas login/registro: **sí**.
- Ruta(s) privada(s) con guard: **sí** (`beforeEach` + `store.getters.isAuthenticated`).

## Entregables documentales

| Entregable | Dónde |
|------------|--------|
| Código fuente Vue | `src/` en la raíz del repo |
| README con sistema de usuarios, rutas, GitHub, ejecución | `README.md` (raíz) + esta carpeta |
| ZIP del proyecto | Generar manualmente incluyendo `MODULO7_ENTREGA/` |

## Opcional según diseño / rúbrica original

- **Axios**: la rúbrica permite API simulada; este proyecto usa **mock con Promises**. Se puede sustituir por `axios.post` a un API real sin cambiar la firma de las acciones.
