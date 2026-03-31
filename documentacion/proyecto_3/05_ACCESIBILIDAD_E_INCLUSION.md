# 5. Accesibilidad e inclusión (complemento al portafolio)

Este documento forma parte del **Proyecto 3** y describe cómo **complementar** el portafolio digital (**ClimaTorre**) con una perspectiva **inclusiva**, orientada a que **personas ciegas o con baja visión** y **personas sordas o con hipoacusia** puedan acceder y usar el producto de forma más equitativa. Es material de reflexión y planificación; la implementación técnica evoluciona en el código (`src/`).

**Prioridad frente a las rúbricas:** las mejoras aquí descritas son **opcionales** y **no sustituyen** el cumplimiento de las rúbricas del curso. El criterio vinculante sigue siendo el documentado en **[`RUBRICA_CUMPLIMIENTO.md`](../../RUBRICA_CUMPLIMIENTO.md)** (Módulo 7) y lo que exija cada asignatura. Cualquier complemento (accesibilidad, textos adicionales, anexos) debe **mantener intactos** los requisitos ya cumplidos; si hubiera tensión entre una mejora extra y un ítem de rúbrica, **prevalece la rúbrica**.

---

## 5.1 Por qué importa en el portafolio profesional

Un portafolio TI no solo muestra código: muestra **criterio**. Documentar accesibilidad (aunque sea como roadmap) demuestra conciencia de **diversidad de usuarios**, alineación con estándares (p. ej. [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)) y responsabilidad en el diseño de interfaces.

---

## 5.2 Personas ciegas o con baja visión (lectores de pantalla, teclado)

| Área | Buena práctica | Notas aplicables a ClimaTorre |
|------|----------------|--------------------------------|
| **Semántica HTML** | Usar `main`, `nav`, `footer`, encabezados jerárquicos (`h1`…`h6`) | Evitar que el título principal de cada vista sea solo decorativo; un `h1` por vista ayuda al lector de pantalla. |
| **Saltar al contenido** | Enlace “Saltar al contenido principal” visible al enfocar | Reduce repetición del menú en cada carga. |
| **Rutas SPA** | Anunciar cambios de vista (`aria-live` o foco en `h1`) | Vue Router no cambia de página real; hay que comunicar el contexto nuevo. |
| **Formularios** | Cada control con `<label>` asociado o `aria-label` | Login/Registro ya usan `label` + `for`; mantener el patrón en el resto. |
| **Errores** | Mensajes con `role="alert"` o `aria-live` | Ya presente en login/registro; extender si hay más flujos. |
| **Iconos** | Decorativos: `aria-hidden="true"`; botones solo icono: `aria-label` | Tema claro/oscuro y marca: no depender solo de `title`. |
| **Estados interactivos** | `aria-pressed` en interruptores (p. ej. favoritos) | Ya usado en favoritos; revisar textos accesibles del botón. |
| **Teclado** | Todo interactivo alcanzable con Tab; foco visible | Evitar quitar `outline` sin sustituto; orden de tab lógico. |
| **Contraste** | Texto legible sobre fondo (objetivo AA mínimo) | Revisar modo claro y oscuro. |
| **Pruebas** | NVDA, VoiceOver, navegación solo teclado | Evidencia de calidad para el portafolio. |

---

## 5.3 Personas sordas o con hipoacusia

| Situación | Enfoque |
|-----------|---------|
| **Aplicación solo visual y textual** (como ClimaTorre hoy, sin audio obligatorio) | No hay barrera por “solo audio”; la información crítica debe seguir siendo **texto** y **no depender solo de color**. |
| **Vídeo o audio en el futuro** (demo, tutorial) | **Subtítulos cerrados**; **transcripción** opcional; si el curso lo pide, valorar **Lengua de Señas** en un vídeo aparte (contenido, no sustituto del subtítulo). |
| **Comunicación con el autor** | Ofrecer **canales escritos** (correo, Issues en GitHub) favorece a quien no usa llamada telefónica. |

---

## 5.4 Cómo reflejar esto en el Proyecto 3 (evidencias)

Para el **informe breve** (`03_INFORME_EVIDENCIAS_PROCESO.md`), puede incluir:

- **Herramientas:** lectores de pantalla (NVDA/VoiceOver), extensiones de contraste, Lighthouse (accesibilidad).
- **Cambios / buenas prácticas:** filas de la tabla de la sección 5.2 que haya aplicado o planeado.
- **Nuevas secciones:** p. ej. apartado “Accesibilidad” en el `README.md` raíz, o este documento `05` como anexo de planificación.

En la **reflexión** (`04`), puede mencionar cómo la **inclusión** en el diseño de producto se relaciona con su **proyección profesional** (equipos diversos, cumplimiento normativo).

---

## 5.5 Relación con otros documentos del repositorio

- **`proyecto_2/01_REVISION_PRODUCTO.md`** ya menciona accesibilidad como área mejorable; este documento **concreta** líneas de acción para el portafolio.
- **`RUBRICA_CUMPLIMIENTO.md`** cubre el Módulo 7; la accesibilidad no suele ser criterio explícito de esa rúbrica, pero **complementa** la narrativa de calidad **siempre que** no contradiga ni deje de cumplir lo exigido en evaluación.

---

*Documento de apoyo al Proyecto 3; actualizar cuando se implementen mejoras en el código o en el README.*
