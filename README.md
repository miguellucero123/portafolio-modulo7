# ClimaTorre — Portafolio Módulo 7

SPA con **Vue.js 3**, **Vue Router**, **Vuex** y datos climáticos en tiempo real para los circuitos W y O de **Torres del Paine**.

## Sistema de usuarios (Vuex + mock)

La autenticación está **simulada en el front** (`src/services/authService.js`): credenciales contra una lista de usuarios demo y usuarios registrados guardados en `localStorage`.

### Qué guarda el store por usuario

| Dato | Descripción |
|------|-------------|
| `nombre`, `email`, `id` | Identidad básica (sin contraseña en el estado). |
| `favoriteIds` | IDs de lugares marcados como favoritos. |
| `preferences` | `tempUnit` (`C` / `F`) y `theme` (`light` / `dark`). |

La sesión activa se persiste en `localStorage` bajo la clave `climatorre_vuex_session`. Las preferencias de invitado usan `climatorre_guest_*` y las claves ya existentes `tempUnit` / `theme`.

### Rutas relacionadas con autenticación

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión (correo + contraseña). |
| `/registro` | Alta de usuario simulada (persistida en el navegador). |
| `/favoritos` | **Protegida**: lista de lugares favoritos del usuario (Vuex). |
| `/preferencias-clima` | **Protegida**: edición de unidad de temperatura y tema (Vuex). |

Si se intenta entrar a una ruta protegida sin sesión, la app redirige a `/login` con `?redirect=…` para volver tras un login correcto.

### Cuentas demo

- **Correo:** `demo@climatorre.cl` — **Contraseña:** `demo123`
- **Correo:** `explorador@example.com` — **Contraseña:** `paine2025`

## Características principales

- Pronóstico con **Open-Meteo**, tarjetas de lugares y detalle con gráficos.
- **Vuex**: estado global de autenticación, favoritos y preferencias.
- **Rutas protegidas** con `meta.requiresAuth` y guard en el router.
- Interfaz coherente con modo claro/oscuro y °C/°F sincronizados con el store.

## Repositorio público

Sustituye este enlace por el de tu entrega si es distinto:

**https://github.com/miguellucero123/portafolio_modulo6**

*(Puedes crear un repo nuevo para el Módulo 7 y actualizar el README y el pie de página de la app.)*

## Instalación y uso

```bash
git clone <url-de-tu-repo>
cd modulo7_portafolio
npm install
npm run dev
```

Compilación para producción:

```bash
npm run build
npm run preview
```

## Stack

- Vue 3, Vue Router 4, **Vuex 4**
- Vite 5
- Lucide Vue Next
- Open-Meteo API

---

*Proyecto académico — portafolio Módulo 7 (usuarios y personalización con Vuex).*
