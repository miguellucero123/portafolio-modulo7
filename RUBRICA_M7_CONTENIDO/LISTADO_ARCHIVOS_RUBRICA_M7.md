# Archivos y requisitos — Rúbrica Módulo 7

## Implementación técnica (código)

| Requisito explícito | Ubicación principal |
|---------------------|---------------------|
| Vuex: state, mutations, actions (auth, preferencias, favoritos) | `src/store/index.js` |
| Servicio de auth simulado | `src/services/authService.js` |
| Vue Router + rutas protegidas | `src/router/index.js` |
| Login | `src/views/Login.vue` |
| Registro | `src/views/Registro.vue` |
| Favoritos (ruta protegida) | `src/views/Favoritos.vue` |
| Preferencias de clima (ruta protegida) | `src/views/PreferenciasClima.vue` |
| Shell: sesión, navbar, preferencias globales | `src/App.vue` |
| Punto de entrada + store + router | `src/main.js` |
| Favoritos en tarjetas / detalle | `src/components/PlaceCard.vue`, `src/views/LugarDetalle.vue` |
| Redirección segura post-login | `src/utils/sanitizeRedirectPath.js` |
| SPA base M6 (clima, listado, detalle) | Resto de `src/` |

## Configuración y estáticos

| Archivo | Uso |
|---------|-----|
| `index.html` | Entrada Vite |
| `vite.config.js` | Build y alias |
| `package.json` / `package-lock.json` | Dependencias (Vue, Router, Vuex, Vite) |
| `public/_redirects` | Despliegue SPA (Netlify) |
| `netlify.toml` | Build y redirects en Netlify |

## Entregables documentales (rúbrica)

| Entregable | Archivo |
|------------|---------|
| Descripción del sistema de usuarios, rutas, GitHub, ejecución | `README.md` |
| Comprobación explícita frente al enunciado | `RUBRICA_CUMPLIMIENTO.md` |
| Matriz de requisitos y dependencias (anexo) | `MODULO7_ENTREGA/` (01–04, README, manifiestos, scripts) |

## No incluidos en la copia “solo rúbrica”

- Código legacy en raíz (`js/`, `scss/`, `css/` sin uso en la SPA Vite actual).
- Clones y respaldos (`CLON_PROYECTO_ORIGINAL/`, `backup/`).
- Documentación opcional post-rúbrica: `MODULO7_ENTREGA/05_OPCIONAL_*.md`.
