# 2. Construcción o revisión del portafolio (caso ClimaTorre)

El documento **[`00_CONTEXTO_PORTAFOLIO_M7_Y_PROYECTO_2.md`](./00_CONTEXTO_PORTAFOLIO_M7_Y_PROYECTO_2.md)** detalla tablas de referencia al **cumplimiento M7** (`RUBRICA_CUMPLIMIENTO.md`, `MODULO7_ENTREGA/`) y a los archivos de **`proyecto_2/`**; lo siguiente resume cómo ese contexto alimenta la narrativa de este apartado.

## 2.1 Situación: portafolio existente

Este proyecto parte de un **portafolio ya iniciado**: una SPA **Vue 3** con **Vue Router** y **Vuex**, orientada a un caso de uso concreto (consulta climática en Torres del Paine) y ampliada en el **Módulo 7** con autenticación simulada, rutas protegidas, favoritos y preferencias.

La **revisión** según buenas prácticas incluyó, entre otras líneas (véanse también `proyecto_2/` y `RUBRICA_CUMPLIMIENTO.md`):

| Área | Buena práctica | Evidencia en el repositorio |
|------|----------------|----------------------------|
| Código y seguridad básica | Evitar redirecciones abiertas tras login | `src/utils/sanitizeRedirectPath.js` |
| Dependencias | Herramientas actualizadas y auditoría | Vite 6, `npm audit` documentado |
| Despliegue | Sitio reproducible y rutas SPA | `netlify.toml`, `public/_redirects` |
| Profesionalización | README claro, enlace a repo correcto, trazabilidad rúbrica | `README.md`, `RUBRICA_CUMPLIMIENTO.md` |
| Portafolio narrativo | Documentación de revisión, mejoras y cierre | `proyecto_2/` |
| Inclusión y accesibilidad (planificación) | Criterios para lectores de pantalla, teclado y usuarios sin dependencia de audio | [`05_ACCESIBILIDAD_E_INCLUSION.md`](./05_ACCESIBILIDAD_E_INCLUSION.md) |

## 2.2 Herramientas digitales utilizadas (referencia)

| Herramienta | Uso en este portafolio |
|-------------|-------------------------|
| **Git / GitHub** | Control de versiones, repositorio público, difusión del código |
| **Node.js / npm** | Entorno de desarrollo y dependencias declaradas |
| **Vite** | Build y servidor de desarrollo |
| **Netlify** (u otro) | Hosting de la SPA compilada |
| **Markdown** | Documentación técnica y académica en el repo |

*[COMPLETAR: añada aquí otras herramientas que use personalmente (p. ej. Figma, canal de video, LinkedIn, otro hosting).]*

## 2.3 Identidad profesional en el portafolio

Un portafolio sólido comunica **qué problema resuelves**, **con qué stack** y **cómo trabajas** (documentación, despliegue, cuidado por la seguridad y la mantenibilidad). En este repositorio, la identidad se apoya en:

- Un **producto demo coherente** (ClimaTorre) y no solo fragmentos sueltos.
- **Transparencia** sobre limitaciones (mock de autenticación, alcance académico).
- **Carpetas de entrega** y scripts que muestran orden y reproducibilidad.

*[COMPLETAR: párrafo breve sobre cómo usted quiere ser percibido/a como profesional TI (rol, tecnologías de interés, tipo de empresa u sector).]*

## 2.4 Mejoras aplicadas frente a una versión anterior

*[COMPLETAR: liste mejoras concretas si parte de un estado previo del mismo repo o de otro portafolio; si este es su primer consolidado, indíquelo y describa qué decisiones tomó para alinear el trabajo a buenas prácticas.]*
