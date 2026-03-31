# Cumplimiento — rúbrica explícita portafolio final (Portafolio 8)

Auditoría del producto **ClimaTorre** frente a los criterios **explícitos** del enunciado de versión final. Referencia de implementación en el repositorio `portafolio-modulo7`.

**Producto terminado integrado:** la misma aplicación cumple la **rúbrica Portafolio 8** y **conserva todas las capacidades y mejoras del Portafolio 7** (Módulo 7: auth, Vuex de usuario, rutas protegidas, favoritos, preferencias, saneamiento de redirección, etc.). La narrativa unificada está en **[`01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md`](./01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md)**.

---

## 1) Propósito

| Criterio | Evidencia |
|----------|-----------|
| Versión final integrando HTML/CSS/JS, API, Vue, Vue Router, Vuex | SPA en `src/`; estilos en componentes y `src/assets/styles`; `weatherService.js` + composición API; vistas Vue; `src/router/index.js`; **Vuex unificado** (clima + usuario/preferencias/favoritos) en `src/store/index.js` |
| **Incluye lo construido en módulos previos** (sin sustituir el trabajo intermedio) | Base M6/M7 permanece operativa: listado/detalle, **login/registro**, **Vuex auth**, **`/favoritos`**, **`/preferencias-clima`**, guards; ver **[`RUBRICA_CUMPLIMIENTO.md`](../../RUBRICA_CUMPLIMIENTO.md)** y **[`01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md`](./01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md)** |
| Publicada como portafolio en GitHub | Repositorio público enlazado en [`README.md`](../../README.md); pie de app en `App.vue` |
| Aplicación funcionando, documentación e instrucciones locales | [`README.md`](../../README.md): requisitos, `npm install`, `npm run dev`, rutas (clima + auth), variables/API, descripción funcional |

---

## 2) Alcance (MVP final)

### 2.1 SPA en Vue + rutas

| Criterio | Evidencia |
|----------|-----------|
| **Home:** listado de lugares con clima actual | [`Home.vue`](../../src/views/Home.vue), tarjetas lugar + temperatura/estado |
| **Detalle:** pronóstico varios días + estadísticas semana | [`LugarDetalle.vue`](../../src/views/LugarDetalle.vue): `pronosticoSemanal`, sección estadísticas, gráfico tendencia |
| **Vista/componente extra** (configuración, favoritos, historial, etc.) | `/favoritos`, `/preferencias-clima` (autenticado); login/registro (Módulo 7). Opcional: favoritos en tarjeta/detalle |

### 2.2 Consumo de API de clima

| Criterio | Evidencia |
|----------|-----------|
| Datos desde API externa (no fijos como única fuente) | **Open-Meteo** en [`weatherService.js`](../../src/services/weatherService.js): `fetch` por coordenadas; actualización y caché en `localStorage` |
| Axios **o** fetch | Uso de **`fetch`** nativo (alternativa válida al enunciado) |
| Estados “cargando…” y error | `weatherLoading`, `weatherError` en **Vuex**; UI en `Home.vue` (`loading`, `error` vía `useWeather` → store); detalle usa mismo flujo |

### 2.3 Vuex — estado global

| Criterio | Evidencia |
|----------|-----------|
| Lista de lugares | `state.weatherLugares` + getter `weatherLugares` / `lugarByWeatherId` en [`store/index.js`](../../src/store/index.js) |
| Lugar seleccionado y pronóstico | `selectedLugarId` + getter `lugarSeleccionadoPronostico`; se actualiza en detalle con `SET_SELECTED_LUGAR_ID` |
| Preferencias (°C/°F) y banderas carga/error | `preferences.tempUnit` (y `theme`); `weatherLoading`, `weatherError` |
| Acción que consulta API | `fetchWeather` en store; [`useWeather.js`](../../src/composables/useWeather.js) delega en `dispatch('fetchWeather')` |

### 2.4 Estadísticas y alertas meteorológicas

| Criterio | Evidencia |
|----------|-----------|
| Estadísticas semanales: mín, máx, promedio, conteos por tipo de clima | [`calcularEstadisticas`](../../src/utils/helpers.js) + UI en `LugarDetalle.vue` (`diasPorEstado`, tarjetas) |
| Al menos **una alerta** por reglas simples | Sección **“Alertas meteorológicas”** en `LugarDetalle.vue`: reglas semana lluviosa / ola de calor / viento fuerte |

### 2.5 Estabilidad mínima

| Criterio | Evidencia |
|----------|-----------|
| Errores en llamadas API (mensaje al usuario) | `weatherError` en store; mensajes en `Home.vue` cuando falla la carga |
| Errores en formularios | Login/Registro: `role="alert"` y textos claros; validación HTML5 `required` |

---

## 3) Entregables

| Criterio | Evidencia |
|----------|-----------|
| Proyecto en **un único .zip** | Responsabilidad de entrega; script [`empaquetar-portafolio-m7.ps1`](../../scripts/empaquetar-portafolio-m7.ps1) genera ZIP desde la raíz |
| **README.md** con enlace GitHub público | [`README.md`](../../README.md) sección repositorio |
| Instrucciones locales: requisitos Node/npm | [`README.md`](../../README.md) |
| Pasos `npm install`, `npm run dev` (o similar) | [`README.md`](../../README.md) |
| Variables / API key / `.env` si corresponde | [`README.md`](../../README.md) sección **Variables de entorno y API** — Open-Meteo **sin clave** por defecto |
| Rutas principales | [`README.md`](../../README.md): Home, Detalle (`/lugar/:id`), favoritos, preferencias, login, registro |
| Descripción funcional: API, estadísticas, alertas, preferencias | [`README.md`](../../README.md) + este documento |
| Capturas opcionales | Opcional — puede añadir imágenes en README o en carpeta `docs/` según docente |
| Trazabilidad **Portafolio 7** + mejoras de cierre | [`RUBRICA_CUMPLIMIENTO.md`](../../RUBRICA_CUMPLIMIENTO.md), [`proyecto_2/`](../proyecto_2/README.md), [`MODULO7_ENTREGA/`](../MODULO7_ENTREGA/README.md); síntesis en [`01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md`](./01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md) |

---

## 4) Portafolio 7 (Módulo 7) y mejoras — incluidas en el mismo producto terminado

Lo siguiente **no se retiró** al cerrar el Portafolio 8; forma parte del entregable único y puede verificarse en el código hoy.

### 4.1 Criterios M7 (Portafolio 7) — resumen de evidencia

| Bloque M7 | Evidencia (persistente) |
|-----------|-------------------------|
| Usuarios, Vuex auth, mock | `authService.js`, acciones `login` / `register` / `logout`, estado `user` |
| Pantallas `/login`, `/registro` | `Login.vue`, `Registro.vue` |
| Rutas protegidas | `/favoritos`, `/preferencias-clima`; `meta.requiresAuth` |
| Preferencias y favoritos desde store | `preferences`, `favoriteIds`, `TOGGLE_FAVORITE`, vistas asociadas |
| Redirección segura tras login | `sanitizeRedirectPath.js` en login/registro |
| Entregables M7 (código, README, ZIP) | Compartidos con el mismo repo; ver [`RUBRICA_CUMPLIMIENTO.md`](../../RUBRICA_CUMPLIMIENTO.md) secciones 5–6 |

### 4.2 Mejoras documentadas (Proyecto 2 / operación)

| Mejora | Evidencia |
|--------|-----------|
| Toolchain Vite 6, dependencias saneadas | `package.json`, `package-lock.json` |
| Despliegue SPA | `netlify.toml`, `public/_redirects` |
| Enlaces y README al día | `README.md`, `App.vue` (footer) |
| Scripts de empaquetado | `scripts/empaquetar-portafolio-m7.ps1`, `scripts/extraer-rubrica-m7.ps1` |

### 4.3 Lectura recomendada para el evaluador

1. **[`01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md`](./01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md)** — cómo se presenta el producto único.  
2. **Secciones 1–3 de este documento** — criterios explícitos Portafolio 8.  
3. **[`RUBRICA_CUMPLIMIENTO.md`](../../RUBRICA_CUMPLIMIENTO.md)** — detalle M7 si la evaluación lo exige por separado.

---

*Revisión documental: marzo 2026. Actualizar si cambia el enunciado o el código de referencia.*
