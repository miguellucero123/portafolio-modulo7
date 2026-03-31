---
title: "Informe Proyecto 3 — Portafolio profesional y difusión digital"
subtitle: "Evidencias, reflexión y marco documental (ClimaTorre)"
---

# Informe Proyecto 3

**Producto de referencia en portafolio:** SPA **ClimaTorre** (Vue 3, Vue Router, Vuex) — repositorio `portafolio-modulo7`.  
**Propósito de este documento:** entregar en un solo archivo lo pedido en el **punto 2** (evidencia del proceso) y **punto 3** (reflexión personal), más el **contexto M7 y proyecto 2**, el **marco**, la **narrativa de construcción/revisión** (`00`, `01`, `02`) y el **complemento de accesibilidad e inclusión** (`05`).

---

# PARTE A — Evidencia del proceso y reflexión (entrega típica en Word)

## A.1 Herramientas utilizadas para construir o mejorar el portafolio

| Herramienta digital | Para qué la usé |
|---------------------|-----------------|
| [COMPLETAR: ej. GitHub] | [COMPLETAR] |
| [COMPLETAR: ej. Netlify / otro hosting] | [COMPLETAR] |
| [COMPLETAR] | [COMPLETAR] |

## A.2 Cambios aplicados en base a las buenas prácticas

| Buena práctica o criterio visto en clase | Cambio concreto realizado |
|------------------------------------------|---------------------------|
| [COMPLETAR] | [COMPLETAR] |
| [COMPLETAR] | [COMPLETAR] |
| [COMPLETAR] | [COMPLETAR] |

## A.3 Nuevas secciones o elementos añadidos al portafolio

| Elemento o sección nueva | Descripción breve |
|--------------------------|-------------------|
| [COMPLETAR] | [COMPLETAR] |
| [COMPLETAR] | [COMPLETAR] |

## A.4 Enlaces de evidencia (opcional)

| Recurso | URL o ubicación |
|---------|-----------------|
| Repositorio público | [COMPLETAR] |
| Sitio en vivo (si aplica) | [COMPLETAR] |
| Otro | [COMPLETAR] |

## A.5 Reflexión personal

**Pregunta del enunciado:** ¿Cómo crees que este portafolio contribuirá a tu inserción y proyección en la industria TI?

**Respuesta:**

[COMPLETAR: un párrafo o texto breve en primera persona.]

---

# PARTE B — Documentación completa (equivalente a `00`, `01`, `02` y `05` en proyecto_3)

*El contenido siguiente coincide con `00_CONTEXTO_PORTAFOLIO_M7_Y_PROYECTO_2.md`, `01_MARCO_OBJETIVOS_Y_ENUNCIADO.md`, `02_PORTAFOLIO_CONSTRUCCION_REVISION.md` y `05_ACCESIBILIDAD_E_INCLUSION.md`.*

## B.0 Mismo contenido que `00_CONTEXTO_PORTAFOLIO_M7_Y_PROYECTO_2.md`

### 0. Contexto: portafolio Módulo 7 y Proyecto 2

Este documento concentra la **información necesaria** del trabajo **Módulo 7** (producto ClimaTorre frente a la rúbrica) y de la carpeta **`proyecto_2/`** (revisión, depuración, feedback y cierre). Sirve de puente para el **Proyecto 3**: al documentar herramientas, cambios y reflexión, puede citar estas fuentes sin depender de que el lector conozca todo el repositorio.

#### 0.1 Módulo 7 — qué aporta al portafolio técnico

El **Módulo 7** exige una SPA **Vue 3** con **Vue Router** y **Vuex**, **autenticación simulada** en cliente, **rutas protegidas**, **favoritos** y **preferencias** desde el estado global, **README** con instrucciones y **repositorio público** (GitHub).

| Recurso en el repo | Contenido relevante |
|--------------------|---------------------|
| `RUBRICA_CUMPLIMIENTO.md` | Auditoría **criterio → evidencia** (propósito, objetivos, alcance, requisitos funcionales/técnicos, entregables). Es la referencia principal para “qué cumple” el portafolio M7. |
| `MODULO7_ENTREGA/README.md` | Matriz de requisitos, dependencias npm, mapa código–requisitos; carpeta de entrega académica junto al código. |
| `portafolio_8/README.md` | Producto terminado (M7 + rúbrica final integrada); síntesis en `01_PRODUCTO_TERMINADO_INTEGRACION_PORTAFOLIO_7.md`. |
| `README.md` (raíz) | Vista mínima en GitHub; detalle en `docs/README_DOCUMENTACION.md` (rutas, credenciales, Netlify, etc.). |
| `docs/DEPLOY_NETLIFY.md` | Evidencia de **difusión** del portafolio vía hosting. |
| `scripts/extraer-rubrica-m7.ps1` | Genera copia mínima alineada a rúbrica en `RUBRICA_M7_CONTENIDO/entrega/`. |
| `scripts/empaquetar-portafolio-m7.ps1` | Empaqueta el proyecto para entrega en ZIP (`portafolio-m7/`). |

**Stack y piezas clave (resumen):** Vue 3, Vue Router, Vuex; mock en `src/services/authService.js`; store en `src/store/index.js`; guards y rutas en `src/router/index.js`; saneamiento de redirección en `src/utils/sanitizeRedirectPath.js`; despliegue con `netlify.toml` y `public/_redirects`.

#### 0.2 Proyecto 2 — revisión, mejora y cierre del producto

La carpeta **`proyecto_2/README.md`** documenta el **ciclo de mejora** del mismo portafolio: auditoría del producto, depuración (código, dependencias, UX), integración de **feedback** y **criterios de entrega** final. Complementa el código con narrativa profesional.

| Documento | Contenido |
|-----------|-----------|
| `proyecto_2/01_REVISION_PRODUCTO.md` | Fortalezas, riesgos, oportunidades de optimización. |
| `proyecto_2/02_DEPURACION_MEJORAS.md` | Correcciones y mejoras aplicadas (p. ej. open redirect, Vite 6, enlaces). |
| `proyecto_2/03_FEEDBACK_RETROALIMENTACION.md` | Retroalimentación docente/pares (plantillas `[COMPLETAR]`). |
| `proyecto_2/04_CIERRE_ENTREGABLE.md` | Versión “portafolio”, checklist, mantenimiento. |
| `proyecto_2/ANEXO_VISION_SENIOR.md` | Principios de ingeniería y deuda técnica priorizada. |
| `proyecto_2/INFORME_PROYECTO_2_COMPLETO.md` | Informe unificado (Word / Parte A + B) alineado a los anteriores. |

Para el **Proyecto 3**, este material prueba que el portafolio no es solo código: incluye **evaluación**, **mejora documentada** y **trazabilidad** frente a buenas prácticas.

#### 0.3 Relación entre M7, Proyecto 2 y Proyecto 3

| Capa | Rol |
|------|-----|
| **Módulo 7** | Producto demostrable (SPA + auth + Vuex + rutas) y cumplimiento de rúbrica. |
| **Proyecto 2** | Cómo se **revisó y mejoró** ese producto para presentarlo como pieza de portafolio. |
| **Proyecto 3** | Cómo se **presenta y difunde** el portafolio personalmente (herramientas, evidencias, reflexión), apoyándose en lo anterior. |

*Al completar `03` y `04` en `proyecto_3/`, puede referenciar explícitamente `RUBRICA_CUMPLIMIENTO.md`, `MODULO7_ENTREGA/` y los informes de `proyecto_2/` como respaldo del proceso.*

#### 0.4 Prioridad: cumplimiento de rúbricas

La documentación del **Proyecto 3** y los complementos (p. ej. `05_ACCESIBILIDAD_E_INCLUSION.md`) **no reemplazan** la verificación frente a la rúbrica del **Módulo 7** ni la de otras evaluaciones. Mientras se **cumplan** esos criterios documentados en `RUBRICA_CUMPLIMIENTO.md`, puede ampliar el relato del portafolio con herramientas, reflexión e inclusión sin poner en riesgo el entregable evaluado.

## B.1 Mismo contenido que `01_MARCO_OBJETIVOS_Y_ENUNCIADO.md`

### 1. Marco, objetivos y enunciado (Proyecto 3)

Antes de redactar las evidencias, conviene leer **`00_CONTEXTO_PORTAFOLIO_M7_Y_PROYECTO_2.md`**, donde se resume el **Módulo 7** (rúbrica, entregables, scripts) y el contenido de **`proyecto_2/`** (revisión y cierre del producto).

#### 1.1 Objetivos de aprendizaje

- Aplicar buenas prácticas en la construcción de un **portafolio de productos**.
- Utilizar **herramientas digitales** adecuadas para presentar y difundir el portafolio.
- Desarrollar un **portafolio personal** que refleje la identidad profesional del estudiante.
- **Evaluar y mejorar** un portafolio existente mediante la incorporación de buenas prácticas aprendidas.

#### 1.2 Instrucciones oficiales (resumen)

##### 1. Construcción o actualización del portafolio

**Si aún no cuentas con un portafolio**

- Construye tu portafolio aplicando las buenas prácticas vistas en clase.
- Utiliza al menos una herramienta digital (por ejemplo: GitHub, hosting, página web personal, YouTube u otra de tu elección).

**Si ya tienes un portafolio**

- Revísalo en base a las buenas prácticas estudiadas.
- Realiza las correcciones y mejoras necesarias.

##### 2. Evidencia del proceso

Documenta en un **breve informe**:

- Qué **herramientas** utilizaste para construir o mejorar tu portafolio.
- Qué **cambios** aplicaste en base a las buenas prácticas.
- Qué **nuevas secciones o elementos** añadiste.

##### 3. Reflexión personal

Escribe un **párrafo** respondiendo:

- ¿Cómo crees que este portafolio contribuirá a tu **inserción y proyección** en la industria TI?

#### 1.3 Relación con este repositorio

En el caso del producto **ClimaTorre** (`portafolio-modulo7`), el portafolio digital se materializa principalmente como:

- **Repositorio público en GitHub** con código fuente, historial y documentación.
- **Aplicación desplegable** (por ejemplo en **Netlify** u otro hosting) como evidencia ejecutable.
- **Documentación** en Markdown (README, carpetas de entrega, rúbrica) que da cuenta del proceso y de la calidad del trabajo.

El estudiante debe **completar** los documentos `03` y `04` (y las tablas `[COMPLETAR]`) con su voz y su contexto personal; las plantillas de esta carpeta sirven de guía, no sustituyen la autoria.

## B.2 Mismo contenido que `02_PORTAFOLIO_CONSTRUCCION_REVISION.md`

### 2. Construcción o revisión del portafolio (caso ClimaTorre)

El documento **`00_CONTEXTO_PORTAFOLIO_M7_Y_PROYECTO_2.md`** detalla tablas de referencia al **cumplimiento M7** (`RUBRICA_CUMPLIMIENTO.md`, `MODULO7_ENTREGA/`) y a los archivos de **`proyecto_2/`**; lo siguiente resume cómo ese contexto alimenta la narrativa de este apartado.

#### 2.1 Situación: portafolio existente

Este proyecto parte de un **portafolio ya iniciado**: una SPA **Vue 3** con **Vue Router** y **Vuex**, orientada a un caso de uso concreto (consulta climática en Torres del Paine) y ampliada en el **Módulo 7** con autenticación simulada, rutas protegidas, favoritos y preferencias.

La **revisión** según buenas prácticas incluyó, entre otras líneas (véanse también `proyecto_2/` y `RUBRICA_CUMPLIMIENTO.md`):

| Área | Buena práctica | Evidencia en el repositorio |
|------|----------------|----------------------------|
| Código y seguridad básica | Evitar redirecciones abiertas tras login | `src/utils/sanitizeRedirectPath.js` |
| Dependencias | Herramientas actualizadas y auditoría | Vite 6, `npm audit` documentado |
| Despliegue | Sitio reproducible y rutas SPA | `netlify.toml`, `public/_redirects` |
| Profesionalización | README claro, enlace a repo correcto, trazabilidad rúbrica | `README.md`, `RUBRICA_CUMPLIMIENTO.md` |
| Portafolio narrativo | Documentación de revisión, mejoras y cierre | `proyecto_2/` |
| Inclusión y accesibilidad (planificación) | Criterios para lectores de pantalla, teclado y usuarios sin dependencia de audio | `05_ACCESIBILIDAD_E_INCLUSION.md` |

#### 2.2 Herramientas digitales utilizadas (referencia)

| Herramienta | Uso en este portafolio |
|-------------|-------------------------|
| **Git / GitHub** | Control de versiones, repositorio público, difusión del código |
| **Node.js / npm** | Entorno de desarrollo y dependencias declaradas |
| **Vite** | Build y servidor de desarrollo |
| **Netlify** (u otro) | Hosting de la SPA compilada |
| **Markdown** | Documentación técnica y académica en el repo |

*[COMPLETAR: añada aquí otras herramientas que use personalmente (p. ej. Figma, canal de video, LinkedIn, otro hosting).]*

#### 2.3 Identidad profesional en el portafolio

Un portafolio sólido comunica **qué problema resuelves**, **con qué stack** y **cómo trabajas** (documentación, despliegue, cuidado por la seguridad y la mantenibilidad). En este repositorio, la identidad se apoya en:

- Un **producto demo coherente** (ClimaTorre) y no solo fragmentos sueltos.
- **Transparencia** sobre limitaciones (mock de autenticación, alcance académico).
- **Carpetas de entrega** y scripts que muestran orden y reproducibilidad.

*[COMPLETAR: párrafo breve sobre cómo usted quiere ser percibido/a como profesional TI (rol, tecnologías de interés, tipo de empresa u sector).]*

#### 2.4 Mejoras aplicadas frente a una versión anterior

*[COMPLETAR: liste mejoras concretas si parte de un estado previo del mismo repo o de otro portafolio; si este es su primer consolidado, indíquelo y describa qué decisiones tomó para alinear el trabajo a buenas prácticas.]*

## B.3 Mismo contenido que `05_ACCESIBILIDAD_E_INCLUSION.md`

### 5. Accesibilidad e inclusión (complemento al portafolio)

Este documento forma parte del **Proyecto 3** y describe cómo **complementar** el portafolio digital (**ClimaTorre**) con una perspectiva **inclusiva**, orientada a que **personas ciegas o con baja visión** y **personas sordas o con hipoacusia** puedan acceder y usar el producto de forma más equitativa. Es material de reflexión y planificación; la implementación técnica evoluciona en el código (`src/`).

**Prioridad frente a las rúbricas:** las mejoras aquí descritas son **opcionales** y **no sustituyen** el cumplimiento de las rúbricas del curso. El criterio vinculante sigue siendo el documentado en **`RUBRICA_CUMPLIMIENTO.md`** (Módulo 7) y lo que exija cada asignatura. Si hubiera tensión entre una mejora extra y un ítem de rúbrica, **prevalece la rúbrica**.

#### 5.1 Por qué importa en el portafolio profesional

Un portafolio TI no solo muestra código: muestra **criterio**. Documentar accesibilidad (aunque sea como roadmap) demuestra conciencia de **diversidad de usuarios**, alineación con estándares (p. ej. WCAG) y responsabilidad en el diseño de interfaces.

#### 5.2 Personas ciegas o con baja visión (lectores de pantalla, teclado)

| Área | Buena práctica | Notas aplicables a ClimaTorre |
|------|----------------|--------------------------------|
| **Semántica HTML** | Usar `main`, `nav`, `footer`, encabezados jerárquicos | Un `h1` por vista ayuda al lector de pantalla. |
| **Saltar al contenido** | Enlace “Saltar al contenido principal” visible al enfocar | Reduce repetición del menú. |
| **Rutas SPA** | Anunciar cambios de vista (`aria-live` o foco en `h1`) | Vue Router no cambia de página real; comunicar el contexto nuevo. |
| **Formularios** | Cada control con `<label>` asociado o `aria-label` | Login/Registro ya usan `label` + `for`. |
| **Errores** | Mensajes con `role="alert"` o `aria-live` | Presente en login/registro. |
| **Iconos** | Decorativos: `aria-hidden="true"`; botones solo icono: `aria-label` | Tema claro/oscuro: no depender solo de `title`. |
| **Estados interactivos** | `aria-pressed` en interruptores (p. ej. favoritos) | Ya usado; revisar textos accesibles del botón. |
| **Teclado** | Todo interactivo alcanzable con Tab; foco visible | Orden de tab lógico. |
| **Contraste** | Texto legible sobre fondo (objetivo AA mínimo) | Revisar modo claro y oscuro. |
| **Pruebas** | NVDA, VoiceOver, navegación solo teclado | Evidencia de calidad para el portafolio. |

#### 5.3 Personas sordas o con hipoacusia

| Situación | Enfoque |
|-----------|---------|
| **Aplicación solo visual y textual** (ClimaTorre sin audio obligatorio) | No hay barrera por “solo audio”; la información crítica debe seguir siendo **texto** y **no depender solo de color**. |
| **Vídeo o audio en el futuro** | **Subtítulos cerrados**; transcripción opcional; valorar **Lengua de Señas** en vídeo aparte si el curso lo pide. |
| **Comunicación con el autor** | **Canales escritos** (correo, Issues en GitHub). |

#### 5.4 Cómo reflejar esto en el Proyecto 3 (evidencias)

Para el **informe breve** (`03`), puede incluir: herramientas (NVDA, Lighthouse); cambios según la tabla 5.2; nuevas secciones (apartado Accesibilidad en README, o este documento `05`). En **04**, puede mencionar inclusión y proyección profesional.

#### 5.5 Relación con otros documentos del repositorio

- **`proyecto_2/01_REVISION_PRODUCTO.md`** menciona accesibilidad como área mejorable; este documento **concreta** líneas de acción.
- **`RUBRICA_CUMPLIMIENTO.md`** cubre el Módulo 7; la accesibilidad **complementa** la narrativa de calidad **siempre que** no contradiga ni deje de cumplir lo exigido en evaluación.

*Documento de apoyo al Proyecto 3; actualizar cuando se implementen mejoras en el código o en el README.*

---

## Generación del archivo Word (.docx)

1. Abrir este archivo en **Microsoft Word** (o VS Code / Typora) y guardar como **.docx**.
2. Con **Pandoc**, desde la carpeta `proyecto_3`:  
   `pandoc INFORME_PROYECTO_3_COMPLETO.md -o INFORME_PROYECTO_3_COMPLETO.docx`
3. Complete **Parte A** antes de entregar; **Parte B** puede servir como anexo o material de apoyo según indique su docente.
