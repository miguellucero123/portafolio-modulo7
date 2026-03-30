# 1. Revisión del producto

## 1.1 Resumen ejecutivo

**ClimaTorre** es una SPA orientada a **consulta de condiciones climáticas** para puntos de interés en Torres del Paine (circuitos W y O), construida sobre **Vue 3**, **Vue Router** y **Vuex**. En el **Módulo 7** se incorporó autenticación simulada, rutas protegidas, favoritos y preferencias persistidas en el cliente.

El producto cumple un **alcance académico definido** (rúbrica M7) y es **desplegable** (Netlify, `netlify.toml`). La **base de datos** de usuarios y sesiones es **local al navegador**; no hay backend de autenticación.

## 1.2 Fortalezas

| Área | Observación |
|------|-------------|
| **Arquitectura** | Separación razonable: vistas, composables (`useWeather`), servicios (`authService`, `weatherService`), store centralizado. |
| **Estado global** | Vuex con acciones asíncronas para login/registro y mutaciones coherentes con persistencia. |
| **Seguridad de navegación** | Redirección post-login acotada a rutas internas (`sanitizeRedirectPath`). |
| **Experiencia** | Flujo de sesión visible en navbar; favoritos accesibles desde listado y detalle. |
| **Build y despliegue** | Vite 6, `npm audit` limpio tras actualización; reglas SPA en Netlify. |
| **Documentación** | README orientado a ejecución; `RUBRICA_CUMPLIMIENTO.md` trazable frente al enunciado. |

## 1.3 Errores, riesgos y aspectos incompletos

| Tipo | Descripción | Severidad | Nota |
|------|-------------|-----------|------|
| **Seguridad (demo)** | Contraseñas de usuarios registrados en `localStorage` en texto plano (mock). | Media (pedagógica) | Esperado en front-only; no es modelo de producción. |
| **Sesión** | Sin expiración ni revocación server-side. | Baja | Coherente con mock. |
| **Pruebas automatizadas** | Sin tests unitarios ni E2E en el repositorio. | Media (mantenimiento) | Cambios en store/router requieren prueba manual. |
| **Accesibilidad** | WCAG no auditado formalmente; mejora incremental posible (focus, `aria-live`). | Media (UX) | No bloquea portafolio académico. |
| **Código legacy en repo** | Carpetas `js/`, `scss/` en raíz de un flujo HTML previo no usados por la SPA Vite. | Baja (ruido) | Excluidos en empaquetado “solo rúbrica” (`RUBRICA_M7_CONTENIDO`). |
| **Internacionalización** | Interfaz en español fijo. | Baja | Mejora futura si el público objetivo es multi-idioma. |

## 1.4 Funcionalidades evaluadas como “completas” respecto al enunciado M7

- Login/registro con mock.
- Vuex: usuario, preferencias, favoritos.
- Rutas `/login`, `/registro`, `/favoritos`, `/preferencias-clima` con guardas.
- Personalización desde store (no hardcodeada como “usuario”).
- README y repositorio público documentados.

## 1.5 Oportunidades de optimización (no bloqueantes)

| Optimización | Beneficio esperado | Esfuerzo relativo |
|--------------|-------------------|-------------------|
| Tests unitarios (store, guard) | Menos regresiones | Medio |
| Lazy loading de rutas | Menor bundle inicial | Bajo |
| Capa `authApi` detrás del mock | Sustitución por API real sin reescribir vistas | Medio |
| Hash de contraseña en cliente (demo) | Mejor higiene pedagógica | Bajo–medio |

## 1.6 Conclusión de la revisión

El producto es **coherente con su propósito académico y portafolio** y **presentable como versión final** dentro de un ámbito de **front-end estático + estado en cliente**. Las limitaciones listadas son **conocidas y acotadas**; la priorización de mejoras futuras debe seguir **impacto vs esfuerzo** y **no comprometer** la estabilidad del entregable sin pruebas.
