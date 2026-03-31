# 1. Producto terminado — integración Portafolio 7 y rúbrica Portafolio 8

Este documento declara cómo **ClimaTorre** es el **producto final** descrito en la rúbrica **Portafolio 8**, **sin omitir** lo construido y mejorado en el **Portafolio 7** (Módulo 7 y trabajo de calidad asociado). La entrega única en el repositorio es **una sola aplicación** que reúne ambos ámbitos.

---

## 1.1 Qué incluye “Portafolio 7” (Módulo 7) dentro del producto

En este proyecto, **Portafolio 7** corresponde al cumplimiento documentado en **[`RUBRICA_CUMPLIMIENTO.md`](../../RUBRICA_CUMPLIMIENTO.md)** y material de apoyo en **`MODULO7_ENTREGA/`**. Capacidades que **siguen presentes** en la versión final:

| Área Portafolio 7 | Qué aporta al producto terminado | Evidencia principal |
|-------------------|-----------------------------------|---------------------|
| **Vue Router** | Navegación SPA (home, detalle, auth, favoritos, preferencias) | `src/router/index.js` |
| **Vuex (usuario)** | Sesión mock, preferencias (°C/°F, tema), favoritos | `src/store/index.js` (`SET_USER`, `TOGGLE_FAVORITE`, …) |
| **Autenticación simulada** | Login, registro, logout, mensajes de error | `Login.vue`, `Registro.vue`, `src/services/authService.js` |
| **Rutas protegidas** | `/favoritos`, `/preferencias-clima` solo con sesión | `meta.requiresAuth`, guards en `router/index.js` |
| **UI acorde a sesión** | Navbar con usuario, accesos condicionados, favoritos en tarjeta/detalle | `App.vue`, `PlaceCard.vue`, `LugarDetalle.vue` |
| **Seguridad de navegación (mejora)** | Redirección post-login limitada a rutas internas | `src/utils/sanitizeRedirectPath.js` |

**Conclusión:** el Portafolio 8 **no reemplaza** el Portafolio 7; **lo incorpora**. El “MVP final” del enunciado 8 se ejecuta **sobre** la misma base que ya cumple la rúbrica 7.

---

## 1.2 Mejoras de ingeniería y portafolio (trazadas en Proyecto 2)

Además de los ítems de lista de la rúbrica M7, el repositorio incorpora **depuración y buenas prácticas** narradas en **[`proyecto_2/`](../proyecto_2/README.md)** (especialmente [`02_DEPURACION_MEJORAS.md`](../proyecto_2/02_DEPURACION_MEJORAS.md)):

| Mejora | Impacto en el producto terminado |
|--------|-----------------------------------|
| **Vite 6** y cadena de dependencias saneada | Build actual y menores riesgos de auditoría |
| **Netlify** (`netlify.toml`, `public/_redirects`) | Despliegue como producto público (portafolio en vivo) |
| **Enlaces y README** coherentes | Presentación profesional al evaluador |
| **Scripts de empaquetado** (`scripts/`) | Entrega `.zip` y copias focalizadas sin errores manuales |

Estas mejoras **permanecen activas** en la misma rama de código que sirve para demostrar el Portafolio 8.

---

## 1.3 Capas Portafolio 8 sobre la base anterior

La rúbrica **Portafolio 8** exige el **cierre integrado** (API, Vuex de clima, estadísticas, alertas). Lo añadido o reforzado **manteniendo** todo lo anterior:

| Exigencia Portafolio 8 | Integración con Portafolio 7 |
|------------------------|-------------------------------|
| **API de clima** (fetch) + carga/error | Coexiste con preferencias y tema ya en Vuex (`preferences`) |
| **Vuex: lista de lugares, selección, pronóstico, flags** | Mismo `store/index.js`: módulo de clima (`weatherLugares`, `fetchWeather`, …) + módulo de usuario M7 |
| **Estadísticas y alertas** en detalle | `LugarDetalle.vue` + `helpers.js`; favoritos M7 siguen en detalle |
| **Mensaje de error API** en Home | Banner `role="alert"`; sesión y formularios M7 sin cambio de contrato |

---

## 1.4 Cómo “mostrar” el producto terminado (checklist para evaluador o vídeo demo)

1. **Sin login:** Home → listado con datos de API; detalle → pronóstico, estadísticas, **alertas meteorológicas**; unidad °C/°F desde navbar.  
2. **Con login (M7):** registro o demo → **favoritos** → **preferencias** → cierre de sesión.  
3. **Repositorio:** enlace en README y pie de app; `npm install` / `npm run dev` según README.  
4. **Opcional:** URL Netlify o capturas en README para refuerzo visual.

---

## 1.5 Documentación relacionada (trazabilidad completa)

| Recurso | Rol |
|---------|-----|
| [`RUBRICA_CUMPLIMIENTO.md`](../../RUBRICA_CUMPLIMIENTO.md) | Portafolio 7 (M7) punto por punto |
| [`RUBRICA_CUMPLIMIENTO_PORTAFOLIO_8.md`](./RUBRICA_CUMPLIMIENTO_PORTAFOLIO_8.md) | Portafolio 8 punto por punto |
| [`proyecto_2/`](../proyecto_2/README.md) | Revisión, feedback y cierre sobre el mismo código |
| [`proyecto_3/`](../proyecto_3/README.md) | Portafolio profesional, inclusión (documental), sin sustituir rúbricas |
| [`MODULO7_ENTREGA/`](../MODULO7_ENTREGA/README.md) | Manifiestos y mapa código–requisitos M7 |

---

*El **único ejecutable** entregable es la SPA en este monorepo; los documentos anteriores prueban el recorrido académico **acumulativo** hasta el producto terminado.*
