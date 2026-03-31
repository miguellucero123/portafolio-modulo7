# 0. Contexto: portafolio Módulo 7 y Proyecto 2

Este documento concentra la **información necesaria** del trabajo **Módulo 7** (producto ClimaTorre frente a la rúbrica) y de la carpeta **`proyecto_2/`** (revisión, depuración, feedback y cierre). Sirve de puente para el **Proyecto 3**: al documentar herramientas, cambios y reflexión, puede citar estas fuentes sin depender de que el lector conozca todo el repositorio.

---

## 0.1 Módulo 7 — qué aporta al portafolio técnico

El **Módulo 7** exige una SPA **Vue 3** con **Vue Router** y **Vuex**, **autenticación simulada** en cliente, **rutas protegidas**, **favoritos** y **preferencias** desde el estado global, **README** con instrucciones y **repositorio público** (GitHub).

| Recurso en el repo | Contenido relevante |
|--------------------|---------------------|
| [`RUBRICA_CUMPLIMIENTO.md`](../RUBRICA_CUMPLIMIENTO.md) | Auditoría **criterio → evidencia** (propósito, objetivos, alcance, requisitos funcionales/técnicos, entregables). Es la referencia principal para “qué cumple” el portafolio M7. |
| [`MODULO7_ENTREGA/`](../MODULO7_ENTREGA/README.md) | Matriz de requisitos, dependencias npm, mapa código–requisitos; carpeta de entrega académica junto al código. |
| [`portafolio_8/`](../portafolio_8/README.md) | **Producto terminado** (integra M7 + rúbrica final clima/Vuex/estadísticas/alertas): [`01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md`](../portafolio_8/01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md) |
| [`README.md`](../README.md) (raíz) | Instalación, ejecución (puerto **5174**), rutas `/login`, `/registro`, `/favoritos`, `/preferencias-clima`, credenciales demo, despliegue Netlify. |
| [`docs/DEPLOY_NETLIFY.md`](../docs/DEPLOY_NETLIFY.md) | Evidencia de **difusión** del portafolio vía hosting. |
| [`scripts/extraer-rubrica-m7.ps1`](../scripts/extraer-rubrica-m7.ps1) | Genera copia mínima alineada a rúbrica en `RUBRICA_M7_CONTENIDO/entrega/`. |
| [`scripts/empaquetar-portafolio-m7.ps1`](../scripts/empaquetar-portafolio-m7.ps1) | Empaqueta el proyecto para entrega en ZIP (`portafolio-m7/`). |

**Stack y piezas clave (resumen):** Vue 3, Vue Router, Vuex; mock en `src/services/authService.js`; store en `src/store/index.js`; guards y rutas en `src/router/index.js`; saneamiento de redirección en `src/utils/sanitizeRedirectPath.js`; despliegue con `netlify.toml` y `public/_redirects`.

---

## 0.2 Proyecto 2 — revisión, mejora y cierre del producto

La carpeta **[`proyecto_2/`](../proyecto_2/README.md)** documenta el **ciclo de mejora** del mismo portafolio: auditoría del producto, depuración (código, dependencias, UX), integración de **feedback** y **criterios de entrega** final. Complementa el código con narrativa profesional.

| Documento | Contenido |
|-----------|-----------|
| [`01_REVISION_PRODUCTO.md`](../proyecto_2/01_REVISION_PRODUCTO.md) | Fortalezas, riesgos, oportunidades de optimización. |
| [`02_DEPURACION_MEJORAS.md`](../proyecto_2/02_DEPURACION_MEJORAS.md) | Correcciones y mejoras aplicadas (p. ej. open redirect, Vite 6, enlaces). |
| [`03_FEEDBACK_RETROALIMENTACION.md`](../proyecto_2/03_FEEDBACK_RETROALIMENTACION.md) | Retroalimentación docente/pares (plantillas `[COMPLETAR]`). |
| [`04_CIERRE_ENTREGABLE.md`](../proyecto_2/04_CIERRE_ENTREGABLE.md) | Versión “portafolio”, checklist, mantenimiento. |
| [`ANEXO_VISION_SENIOR.md`](../proyecto_2/ANEXO_VISION_SENIOR.md) | Principios de ingeniería y deuda técnica priorizada. |
| [`INFORME_PROYECTO_2_COMPLETO.md`](../proyecto_2/INFORME_PROYECTO_2_COMPLETO.md) | Informe unificado (Word / Parte A + B) alineado a los anteriores. |

Para el **Proyecto 3**, este material prueba que el portafolio no es solo código: incluye **evaluación**, **mejora documentada** y **trazabilidad** frente a buenas prácticas.

---

## 0.3 Relación entre M7, Proyecto 2 y Proyecto 3

| Capa | Rol |
|------|-----|
| **Módulo 7** | Producto demostrable (SPA + auth + Vuex + rutas) y cumplimiento de rúbrica. |
| **Proyecto 2** | Cómo se **revisó y mejoró** ese producto para presentarlo como pieza de portafolio. |
| **Proyecto 3** | Cómo se **presenta y difunde** el portafolio personalmente (herramientas, evidencias, reflexión), apoyándose en lo anterior. |

*Al completar `03` y `04` en `proyecto_3/`, puede referenciar explícitamente `RUBRICA_CUMPLIMIENTO.md`, `MODULO7_ENTREGA/` y los informes de `proyecto_2/` como respaldo del proceso.*

### 0.4 Prioridad: cumplimiento de rúbricas

La documentación del **Proyecto 3** y los complementos (p. ej. `05_ACCESIBILIDAD_E_INCLUSION.md`) **no reemplazan** la verificación frente a la rúbrica del **Módulo 7** ni la de otras evaluaciones. Mientras se **cumplan** esos criterios documentados en [`RUBRICA_CUMPLIMIENTO.md`](../RUBRICA_CUMPLIMIENTO.md), puede ampliar el relato del portafolio con herramientas, reflexión e inclusión sin poner en riesgo el entregable evaluado.
