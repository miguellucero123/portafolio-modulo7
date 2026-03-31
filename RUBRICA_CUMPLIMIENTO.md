# Cumplimiento de la rúbrica — Módulo 7

Auditoría frente a los criterios **explícitos** del enunciado. Referencia de implementación en el repositorio actual.

## 1. Propósito

| Criterio | Evidencia |
|----------|-----------|
| Sistema de usuarios con Vue, Vue Router, Vuex | `src/views/*.vue`, `src/router/index.js`, `src/store/index.js` |
| Axios **o** datos mock | Mock: `src/services/authService.js` (sin Axios; permitido por la rúbrica) |
| Estado global de autenticación y preferencias | `src/store/index.js` |
| Reconocimiento del usuario y datos ajustados | `src/App.vue` (sesión), favoritos y preferencias desde Vuex |

## 2. Objetivos de aprendizaje

| Criterio | Evidencia |
|----------|-----------|
| Pantallas registro e inicio de sesión | `Login.vue`, `Registro.vue` |
| Vuex para auth y datos de usuario | Store: `user`, getters, `preferences`, `favoriteIds` |
| Secciones protegidas por ruta | `meta.requiresAuth`, guard en `router/index.js` |
| Interfaz según usuario autenticado | Navbar, `PlaceCard` / `LugarDetalle` (favoritos), preferencias |
| Git/GitHub con commits descriptivos | Responsabilidad del repositorio; historial local y remoto |

## 3. Alcance

| Criterio | Evidencia |
|----------|-----------|
| Ruta `/login` | Definida y componente asociado |
| Ruta `/registro` | Definida y componente asociado |
| Flujo: credenciales → Vuex → redirección Home o última ruta | `Login.vue`, `sessionStorage` + `?redirect=` |
| Flujo: error de login | Mensaje explícito vía `authService` / captura en vista |
| Secciones solo autenticados: favoritos y preferencias de clima | `/favoritos`, `/preferencias-clima` |
| API simulada o endpoint real | Simulación en cliente |

## 4. Requisitos funcionales mínimos

| Criterio | Evidencia |
|----------|-----------|
| Login: correo/usuario + contraseña | `Login.vue` |
| Éxito: usuario en Vuex y redirección | Action `login`, `router.replace` |
| Error: mensaje claro | Texto acorde a *Usuario o contraseña incorrectos* (`authService.js`) |
| Indicador de sesión: nombre, cerrar sesión | `App.vue` |
| Logout: limpiar Vuex y redirigir si aplica | Action `logout`, `onLogout` → `/` si ruta protegida |
| Personalización desde Vuex (no valores fijos como datos de usuario) | `preferences`, `favoriteIds` en store |
| Ruta protegida: sin sesión → `/login` o mensaje | Redirección a `/login` con `redirect` |

## 5. Requisitos técnicos

| Criterio | Evidencia |
|----------|-----------|
| Vuex: state (usuario, preferencias), `isAuthenticated` (getter) | `store/index.js` |
| Mutations: sesión, preferencias, favoritos | `SET_USER`, `CLEAR_USER`, `SET_PREFERENCES`, `TOGGLE_FAVORITE` |
| Actions: login, registro, logout, async | `actions` en `store/index.js` |
| Componentes leen Vuex | `mapState`, `mapGetters`, `mapActions` en vistas y `App.vue` |
| Formularios: `v-model`, `@submit` | `Login.vue`, `Registro.vue` |
| Credenciales: mock o API | Mock |
| Router: login, registro, ruta privada con guard | `router/index.js` |

## 6. Entregables

| Criterio | Evidencia |
|----------|-----------|
| Código fuente Vue (componentes, router, store) | Carpeta `src/` |
| Estilos y recursos | `src/styles`, `src/assets`, estilos en componentes |
| README: sistema de usuarios, rutas, GitHub, ejecución | `README.md` |
| Proyecto en `.zip` | Generación manual para entrega (incluir `src/`, `index.html`, manifiestos npm, etc.) |

## Notas de revisión (implementación actual)

- Redirección post-login: validación de ruta interna en `src/utils/sanitizeRedirectPath.js` (uso en `Login.vue` y `Registro.vue`).
- Documentación opcional no sustitutiva de la rúbrica: `documentacion/MODULO7_ENTREGA/05_OPCIONAL_MEJORAS_ENFOQUE_SENIOR.md`.
- Guía de repositorio Git: `documentacion/tecnico/GITHUB_SETUP_M7.md`.
