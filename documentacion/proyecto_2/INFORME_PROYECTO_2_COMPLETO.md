---
title: "Informe Proyecto 2 — ClimaTorre"
subtitle: "Revisión del producto, depuración, feedback y cierre de portafolio"
---

# Informe Proyecto 2 — ClimaTorre

**Producto:** SPA Vue 3 (ClimaTorre) — consulta climática Torres del Paine + autenticación simulada (Módulo 7).  
**Repositorio:** https://github.com/miguellucero123/portafolio-modulo7  

Este documento reúne **(A)** las secciones solicitadas para entrega en Word y **(B)** el mismo contenido que el `README` de `proyecto_2/`, los archivos `01` a `04` y el anexo (véase Parte B).

---

# PARTE A — Contenido solicitado para Microsoft Word

## A.1 Breve descripción de los errores detectados y corregidos

| Error o riesgo | Descripción | Corrección aplicada |
|----------------|-------------|---------------------|
| Redirección post-login insegura | El parámetro `?redirect=` podía permitir redirección fuera de la aplicación (open redirect). | Utilidad `sanitizeRedirectPath` y uso en `Login.vue` y `Registro.vue` (solo rutas internas). |
| Dependencias vulnerables | `npm audit` reportaba vulnerabilidades en la cadena de herramientas (esbuild / rollup / immutable vía Vite). | `npm audit fix` y actualización a **Vite 6**; verificación de `npm run build`. |
| Enlace obsoleto en la interfaz | Pie de página enlazaba a un repositorio anterior. | Enlace actualizado a **portafolio-modulo7** y `rel="noopener noreferrer"`. |
| Código no utilizado en Vuex | Mutación `SET_FAVORITE_IDS` sin referencias. | Eliminación de la mutación. |
| Comentario desalineado con la rúbrica | Texto que sugería Axios como única vía frente al enunciado. | Comentario ajustado en `authService.js` (mock permitido). |

*Nota:* Las limitaciones del **mock** (p. ej. contraseñas en texto plano en `localStorage` para usuarios registrados) se documentan como **riesgo conocido de entorno demo**, no como error corregible sin backend.

---

## A.2 Mejoras implementadas

| Área | Mejora |
|------|--------|
| Seguridad de navegación | Validación de rutas de redirección tras login y registro. |
| Dependencias | Toolchain actualizada (Vite 6); `npm audit` sin vulnerabilidades reportadas tras la actualización. |
| UX / sesión | Navbar con usuario, cierre de sesión, accesos a favoritos y preferencias alineados con Vuex. |
| Favoritos y preferencias | Interacción desde tarjetas, detalle y páginas dedicadas; estado en store. |
| Despliegue | Netlify (`netlify.toml`, `public/_redirects`) para SPA con historial HTML5. |
| Documentación | README, `RUBRICA_CUMPLIMIENTO.md`, entregas y scripts de empaquetado (ZIP). |
| Portafolio | Carpeta `proyecto_2/` con revisión, depuración, feedback y cierre documentados. |

---

## A.3 Feedback recibido y aplicado

*Complete la tabla con el feedback real de docentes y compañeros.*

| Origen | Sugerencia | ¿Aplicada? | Cómo se reflejó en el producto |
|--------|------------|------------|--------------------------------|
| Docente | [COMPLETAR] | Sí / Parcial / No | [COMPLETAR] |
| Docente | [COMPLETAR] | | |
| Compañero(s) | [COMPLETAR] | | |

**Ejemplos de mejoras frecuentemente alineadas con retroalimentación** (pueden citarse si coinciden con lo recibido):

| Tema | Respuesta en el producto |
|------|--------------------------|
| Login sin bucles incorrectos | Guards `requiresAuth` / `guestOnly` y `redirect` sanitizado. |
| Dependencias sin vulnerabilidades críticas al entregar | Vite 6 y `npm audit` limpio. |
| Portafolio desplegable | Documentación Netlify en `documentacion/tecnico/DEPLOY_NETLIFY.md`. |
| Trazabilidad frente a la rúbrica | `RUBRICA_CUMPLIMIENTO.md` y `MODULO7_ENTREGA/`. |

---

# PARTE B — Documentación completa (equivalente a la carpeta proyecto_2)

*La Parte B reproduce el mismo texto que `README.md`, `01_REVISION_PRODUCTO.md`, `02_DEPURACION_MEJORAS.md`, `03_FEEDBACK_RETROALIMENTACION.md`, `04_CIERRE_ENTREGABLE.md` y `ANEXO_VISION_SENIOR.md` de la carpeta `proyecto_2/` (misma redacción y secciones; aquí agrupado bajo B.1–B.6).*

## B.1 Carpeta proyecto_2 — mismo texto que `README.md`

### Proyecto 2 — Revisión, mejora y cierre de portafolio

Documentación de **cierre de ciclo** del producto **ClimaTorre** (SPA Vue 3, Vue Router, Vuex), alineada a las instrucciones de revisión del producto, depuración, incorporación de feedback y entrega final para portafolio profesional.

**Ámbito del repositorio:** `portafolio-modulo7` (GitHub: `miguellucero123/portafolio-modulo7`).

| Documento en el repo | Contenido |
|----------------------|-----------|
| 01_REVISION_PRODUCTO.md | Auditoría del producto: fortalezas, riesgos, huecos y oportunidades de optimización |
| 02_DEPURACION_MEJORAS.md | Correcciones y mejoras aplicadas (código, UX, dependencias, despliegue) |
| 03_FEEDBACK_RETROALIMENTACION.md | Integración de retroalimentación docente/pares; plantilla para completar con feedback real |
| 04_CIERRE_ENTREGABLE.md | Criterios de “versión final” de portafolio, despliegue y mantenimiento |
| ANEXO_VISION_SENIOR.md | Principios de ingeniería, deuda técnica priorizada y próximos pasos |

### Cómo usar esta documentación

1. Leer en orden **01 → 04** para el informe académico.
2. Completar **03** con el feedback concreto de cada entrega (sustituir marcadores `[COMPLETAR]`).
3. Usar **Anexo** como referencia de madurez técnica en entrevistas o iteraciones posteriores.

*Versión documental: alineada al estado del repositorio tras integración Módulo 7, despliegue Netlify y actualización de dependencias (Vite 6).*

## B.2 Mismo contenido que `01_REVISION_PRODUCTO.md`

### 1. Revisión del producto

#### 1.1 Resumen ejecutivo

**ClimaTorre** es una SPA orientada a **consulta de condiciones climáticas** para puntos de interés en Torres del Paine (circuitos W y O), construida sobre **Vue 3**, **Vue Router** y **Vuex**. En el **Módulo 7** se incorporó autenticación simulada, rutas protegidas, favoritos y preferencias persistidas en el cliente.

El producto cumple un **alcance académico definido** (rúbrica M7) y es **desplegable** (Netlify, `netlify.toml`). La **base de datos** de usuarios y sesiones es **local al navegador**; no hay backend de autenticación.

#### 1.2 Fortalezas

| Área | Observación |
|------|-------------|
| **Arquitectura** | Separación razonable: vistas, composables (`useWeather`), servicios (`authService`, `weatherService`), store centralizado. |
| **Estado global** | Vuex con acciones asíncronas para login/registro y mutaciones coherentes con persistencia. |
| **Seguridad de navegación** | Redirección post-login acotada a rutas internas (`sanitizeRedirectPath`). |
| **Experiencia** | Flujo de sesión visible en navbar; favoritos accesibles desde listado y detalle. |
| **Build y despliegue** | Vite 6, `npm audit` limpio tras actualización; reglas SPA en Netlify. |
| **Documentación** | README orientado a ejecución; `RUBRICA_CUMPLIMIENTO.md` trazable frente al enunciado. |

#### 1.3 Errores, riesgos y aspectos incompletos

| Tipo | Descripción | Severidad | Nota |
|------|-------------|-----------|------|
| **Seguridad (demo)** | Contraseñas de usuarios registrados en `localStorage` en texto plano (mock). | Media (pedagógica) | Esperado en front-only; no es modelo de producción. |
| **Sesión** | Sin expiración ni revocación server-side. | Baja | Coherente con mock. |
| **Pruebas automatizadas** | Sin tests unitarios ni E2E en el repositorio. | Media (mantenimiento) | Cambios en store/router requieren prueba manual. |
| **Accesibilidad** | WCAG no auditado formalmente; mejora incremental posible (focus, `aria-live`). | Media (UX) | No bloquea portafolio académico. |
| **Código legacy en repo** | Carpetas `js/`, `scss/` en raíz de un flujo HTML previo no usados por la SPA Vite. | Baja (ruido) | Excluidos en empaquetado “solo rúbrica” (`RUBRICA_M7_CONTENIDO`). |
| **Internacionalización** | Interfaz en español fijo. | Baja | Mejora futura si el público objetivo es multi-idioma. |

#### 1.4 Funcionalidades evaluadas como “completas” respecto al enunciado M7

- Login/registro con mock.
- Vuex: usuario, preferencias, favoritos.
- Rutas `/login`, `/registro`, `/favoritos`, `/preferencias-clima` con guardas.
- Personalización desde store (no hardcodeada como “usuario”).
- README y repositorio público documentados.

#### 1.5 Oportunidades de optimización (no bloqueantes)

| Optimización | Beneficio esperado | Esfuerzo relativo |
|--------------|-------------------|-------------------|
| Tests unitarios (store, guard) | Menos regresiones | Medio |
| Lazy loading de rutas | Menor bundle inicial | Bajo |
| Capa `authApi` detrás del mock | Sustitución por API real sin reescribir vistas | Medio |
| Hash de contraseña en cliente (demo) | Mejor higiene pedagógica | Bajo–medio |

#### 1.6 Conclusión de la revisión

El producto es **coherente con su propósito académico y portafolio** y **presentable como versión final** dentro de un ámbito de **front-end estático + estado en cliente**. Las limitaciones listadas son **conocidas y acotadas**; la priorización de mejoras futuras debe seguir **impacto vs esfuerzo** y **no comprometer** la estabilidad del entregable sin pruebas.

## B.3 Mismo contenido que `02_DEPURACION_MEJORAS.md`

### 2. Depuración y mejora

#### 2.1 Correcciones de código y estructura

| Problema detectado | Acción aplicada | Ubicación / referencia |
|--------------------|-------------------|-------------------------|
| Posible **open redirect** tras login vía `?redirect=` | Validación de ruta interna en utilidad dedicada | `src/utils/sanitizeRedirectPath.js`; uso en `Login.vue`, `Registro.vue` |
| Mutación **Vuex sin uso** | Eliminación de `SET_FAVORITE_IDS` (no referenciada) | `src/store/index.js` |
| **Código muerto / comentarios** en auth | Comentario alineado a rúbrica (mock permitido) | `src/services/authService.js` |
| **Enlace GitHub** en pie de página desactualizado | `App.vue` apunta a `portafolio-modulo7` | `src/App.vue` |
| **Vulnerabilidades** de dependencias (`esbuild`, `rollup`, `immutable`) | `npm audit fix` + subida a **Vite 6** | `package.json`, `package-lock.json` |
| **Duplicación** de entrega en repo | Carpetas `documentacion/portafolio-m7`, `documentacion/RUBRICA_M7_CONTENIDO` con scripts de empaquetado | `scripts/`, documentación |

#### 2.2 Mejoras de usabilidad y presentación

| Mejora | Descripción |
|--------|-------------|
| **Coherencia de sesión** | Nombre de usuario y “Cerrar sesión” visibles en navbar; enlaces a favoritos y preferencias solo cuando aplica. |
| **Favoritos** | Botón en tarjeta y en detalle; estado visual (corazón) sincronizado con Vuex. |
| **Preferencias** | °C/°F y tema en store y página dedicada; navbar refleja preferencias. |
| **README** | Tono profesional, instrucciones de instalación, enlace a repositorio, sección Netlify. |
| **Pie de página** | Enlace a repositorio correcto; `rel="noopener noreferrer"` en enlaces externos. |

#### 2.3 Eficiencia y operación

| Aspecto | Mejora |
|---------|--------|
| **Build** | Vite 6 mantiene tiempos de compilación adecuados; sin cambios de API en componentes. |
| **Despliegue** | `netlify.toml` + `public/_redirects` para SPA (history); evita 404 en rutas profundas. |
| **Seguridad de dependencias** | `npm audit` sin hallazgos tras actualización de toolchain. |
| **Entregas** | Scripts para ZIP completo y copia “solo rúbrica” reducen error humano al empaquetar. |

#### 2.4 Lo que no se modificó (por decisión de alcance)

- **Backend real** de autenticación (fuera del alcance académico actual).
- **Suite de tests** (no exigida en el enunciado M7; coste de mantenimiento documentado en anexo).
- **Eliminación total** del código legacy en raíz (preservado en repo; excluido en entregas focalizadas).

#### 2.5 Verificación post-mejoras

- `npm run build` exitoso.
- Flujo manual: login → favoritos → preferencias → logout → rutas protegidas redirigen a login.

## B.4 Mismo contenido que `03_FEEDBACK_RETROALIMENTACION.md`

### 3. Incorporación de feedback

#### 3.1 Propósito

Este apartado documenta **cómo** se integra la retroalimentación de **docentes** y **compañeros** en el producto. Las tablas incluyen **ejemplos genéricos** coherentes con un proyecto SPA Vue; debe **completarse** con el feedback concreto de cada evaluación.

---

#### 3.2 Feedback docente

| Sugerencia recibida | ¿Se aplicó? | Cómo contribuye al producto |
|---------------------|-------------|-----------------------------|
| [COMPLETAR: ej. aclarar en README el uso de mock de auth] | Sí / Parcial / No | [COMPLETAR] |
| [COMPLETAR: ej. evidenciar rutas protegidas en documentación] | | |
| [COMPLETAR] | | |

**Notas:** [COMPLETAR: fechas, asignatura, nombre de quien retroalimenta si corresponde a la política del curso.]

---

#### 3.3 Feedback de compañeros (revisión cruzada / pares)

| Sugerencia recibida | ¿Se aplicó? | Cómo contribuye al producto |
|---------------------|-------------|-----------------------------|
| [COMPLETAR: ej. mejorar visibilidad del botón de favoritos] | | |
| [COMPLETAR: ej. mensaje de error más claro en login] | | |
| [COMPLETAR] | | |

---

#### 3.4 Ejemplos de integración ya reflejadas en el código (referencia)

Las siguientes mejoras son **típicas** de retroalimentación en proyectos similares y **ya están** incorporadas en este repositorio; sirven como modelo de respuesta en el informe:

| Tema de feedback | Respuesta en el producto |
|------------------|--------------------------|
| “El login debe redirigir sin volver a login en bucle” | Guard `requiresAuth` + `guestOnly` + `redirect` sanitizado. |
| “Las dependencias no deben mostrar vulnerabilidades graves al entregar” | Actualización a Vite 6 y `npm audit` limpio. |
| “El portafolio debe poder desplegarse” | Netlify documentado (`documentacion/tecnico/DEPLOY_NETLIFY.md`). |
| “La entrega debe ser trazable frente a la rúbrica” | `RUBRICA_CUMPLIMIENTO.md` y carpeta `MODULO7_ENTREGA/`. |

---

#### 3.5 Feedback pendiente o no aplicado (transparencia)

| Sugerencia | Motivo de no aplicar aún | Próximo paso sugerido |
|------------|--------------------------|------------------------|
| [COMPLETAR] | | |
| Tests automatizados | Prioridad y tiempo de entrega | Añadir Vitest en iteración posterior |
| Backend real | Alcance M7 | Diseñar contrato API y sustituir `authService` |

---

*Instrucción para el alumno: reemplace los `[COMPLETAR]` tras cada revisión docente o de pares y mantenga este archivo como historial breve.*

## B.5 Mismo contenido que `04_CIERRE_ENTREGABLE.md`

### 4. Cierre de entregable — versión portafolio

#### 4.1 Definición de “versión final” para portafolio profesional

En este contexto, **versión final** significa:

| Criterio | Estado |
|----------|--------|
| Código **compilable** sin pasos manuales no documentados | `npm install` + `npm run build` |
| **Funcionalidad** alineada al alcance del curso (M6 + M7) | Documentado en `RUBRICA_CUMPLIMIENTO.md` |
| **Repositorio público** actualizado y enlazado desde README y pie de app | `portafolio-modulo7` |
| **Despliegue** reproducible (Netlify) | `netlify.toml`, documentación |
| **Dependencias** sin vulnerabilidades conocidas en reporte `npm audit` | Tras Vite 6 |
| **Documentación** de revisión y cierre | Carpeta `proyecto_2/` |

No implica “sin deuda técnica”, sino **deuda conocida y priorizada** (ver anexo).

#### 4.2 Checklist de presentación

- [ ] URL en vivo (Netlify) o captura de pantalla en README.
- [ ] README con: qué hace la app, cómo ejecutarla, enlace a GitHub.
- [ ] Demostración en 2–3 minutos: login demo → favoritos → preferencias → logout.
- [ ] Mencionar explícitamente limitación (mock, sin backend) si la audiencia es técnica.

#### 4.3 Artefactos de entrega académica

| Artefacto | Ubicación |
|-----------|-----------|
| Código fuente | `src/`, raíz del proyecto |
| ZIP “solo rúbrica” (opcional) | Script `scripts/extraer-rubrica-m7.ps1` → `documentacion/RUBRICA_M7_CONTENIDO/entrega/` |
| ZIP completo (opcional) | `scripts/empaquetar-portafolio-m7.ps1` → `documentacion/portafolio-m7/` |

#### 4.4 Mantenimiento posterior al curso

| Acción | Frecuencia sugerida |
|--------|---------------------|
| `npm audit` + actualizar Vite/Vue menores | Trimestral o al cambiar Node |
| Revisar enlace GitHub y dominio Netlify | Al actualizar CV |
| Añadir tests si el proyecto evoluciona | Antes de incluir en CV “senior” |

#### 4.5 Cierre

El producto **ClimaTorre** (rama `main`, `portafolio-modulo7`) está en condiciones de **mostrarse como pieza de portafolio** dentro del alcance académico descrito. Las iteraciones futuras (API real, tests, i18n) pueden documentarse como **fase 2** sin invalidar esta versión.

---

*Fecha de referencia documental: marzo 2026 (ajustar si el curso corresponde a otro período).*

## B.6 Mismo contenido que `ANEXO_VISION_SENIOR.md`

### Anexo — Visión de ingeniería senior

Este anexo resume **criterios de madurez** que suelen aplicarse en equipos de producto, **sin** sustituir el alcance académico del proyecto.

#### A. Principios aplicados

| Principio | Aplicación en ClimaTorre |
|-----------|---------------------------|
| **Contratos explícitos** | Acciones Vuex con retorno predecible; `authService` desacoplado de vistas. |
| **Defensa en profundidad** | Sanitización de `redirect`; no confundir mock con seguridad real. |
| **Separación de capas** | UI → Vuex → servicio → `localStorage`; no lógica de auth en plantillas. |
| **Observabilidad mínima** | Errores de login visibles al usuario; consola reservada a desarrollo. |
| **Reproducibilidad** | `package-lock.json`, `npm ci`, scripts de empaquetado. |

#### B. Deuda técnica priorizada (backlog)

| Prioridad | Ítem | Tipo | Impacto |
|-----------|------|------|---------|
| P1 | Tests unitarios (store, guard) | Calidad | Alto en proyectos largos |
| P1 | `authService` → `authApi` con `fetch`/`axios` | Evolución | Alto si hay backend |
| P2 | Lazy loading de rutas | Rendimiento | Medio |
| P2 | Hash de contraseña en cliente (demo) | Seguridad pedagógica | Medio |
| P3 | Limpieza de carpetas legacy en raíz | Mantenimiento | Bajo (visual) |
| P3 | ESLint + Prettier en CI | Consistencia | Medio en equipos |

#### C. Riesgos de producto y mitigación

| Riesgo | Mitigación actual |
|--------|-------------------|
| Sesión solo en cliente | Documentado; no se vende como “seguro” |
| Pérdida de datos al limpiar navegador | Esperado en mock; futuro backend |
| Dependencia de CDN externos (fuentes, CSS) | Aceptable en portafolio; alternativa: self-host |

#### D. Métricas que un equipo senior podría añadir (futuro)

- **Web Vitals** (LCP, CLS) en producción.
- **Tasa de error** en login (si hubiera analytics).
- **Tamaño de bundle** por ruta tras lazy loading.

#### E. Relación con el documento opcional de mejoras

En `MODULO7_ENTREGA/05_OPCIONAL_MEJORAS_ENFOQUE_SENIOR.md` hay una línea de expansión post-rúbrica; este anexo **alinea** con esa visión y la **amplía** para el cierre de **proyecto_2**.

---

*Documento interno de portafolio; no sustituye requisitos de la asignatura.*

---

## Generación del archivo Word (.docx)

1. **Opción recomendada:** abrir este archivo `INFORME_PROYECTO_2_COMPLETO.md` en **Visual Studio Code**, **Typora** o **Microsoft Word** (Word 2016+ abre Markdown) y guardar como **.docx**.

2. **Con Pandoc** (si está instalado), desde la carpeta `proyecto_2`:

   `pandoc INFORME_PROYECTO_2_COMPLETO.md -o INFORME_PROYECTO_2_COMPLETO.docx`

   En el repositorio puede existir ya **`INFORME_PROYECTO_2_COMPLETO.docx`** generado con ese comando; vuelva a ejecutarlo si edita el `.md`.

3. Entre **Parte A** y **Parte B** puede insertar un salto de página manual en Word si lo pide el formato de entrega.
