# Anexo — Visión de ingeniería senior

Este anexo resume **criterios de madurez** que suelen aplicarse en equipos de producto, **sin** sustituir el alcance académico del proyecto.

## A. Principios aplicados

| Principio | Aplicación en ClimaTorre |
|-----------|---------------------------|
| **Contratos explícitos** | Acciones Vuex con retorno predecible; `authService` desacoplado de vistas. |
| **Defensa en profundidad** | Sanitización de `redirect`; no confundir mock con seguridad real. |
| **Separación de capas** | UI → Vuex → servicio → `localStorage`; no lógica de auth en plantillas. |
| **Observabilidad mínima** | Errores de login visibles al usuario; consola reservada a desarrollo. |
| **Reproducibilidad** | `package-lock.json`, `npm ci`, scripts de empaquetado. |

## B. Deuda técnica priorizada (backlog)

| Prioridad | Ítem | Tipo | Impacto |
|-----------|------|------|---------|
| P1 | Tests unitarios (store, guard) | Calidad | Alto en proyectos largos |
| P1 | `authService` → `authApi` con `fetch`/`axios` | Evolución | Alto si hay backend |
| P2 | Lazy loading de rutas | Rendimiento | Medio |
| P2 | Hash de contraseña en cliente (demo) | Seguridad pedagógica | Medio |
| P3 | Limpieza de carpetas legacy en raíz | Mantenimiento | Bajo (visual) |
| P3 | ESLint + Prettier en CI | Consistencia | Medio en equipos |

## C. Riesgos de producto y mitigación

| Riesgo | Mitigación actual |
|--------|-------------------|
| Sesión solo en cliente | Documentado; no se vende como “seguro” |
| Pérdida de datos al limpiar navegador | Esperado en mock; futuro backend |
| Dependencia de CDN externos (fuentes, CSS) | Aceptable en portafolio; alternativa: self-host |

## D. Métricas que un equipo senior podría añadir (futuro)

- **Web Vitals** (LCP, CLS) en producción.
- **Tasa de error** en login (si hubiera analytics).
- **Tamaño de bundle** por ruta tras lazy loading.

## E. Relación con el documento opcional de mejoras

En `MODULO7_ENTREGA/05_OPCIONAL_MEJORAS_ENFOQUE_SENIOR.md` hay una línea de expansión post-rúbrica; este anexo **alinea** con esa visión y la **amplía** para el cierre de **proyecto_2**.

---

*Documento interno de portafolio; no sustituye requisitos de la asignatura.*
