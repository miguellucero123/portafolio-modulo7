# Opcional — Enfoque de mejoras posteriores a la rúbrica

Este documento **no forma parte de los entregables mínimos** del Módulo 7. Documenta criterios de evolución opcional del código una vez cumplida la rúbrica.

---

# Enfoque de mejoras — criterio de ingeniería senior

Este documento define **cómo** se plantean las evoluciones del proyecto: priorización, límites de riesgo y alineación con requisitos académicos. **No sustituye** las funcionalidades exigidas por la rúbrica (Vue, Vue Router, Vuex, flujo de autenticación simulado, rutas protegidas, personalización desde el store, documentación en README).

---

## 1. Principios operativos

| Principio | Implicación |
|-------------|-------------|
| **Contratos estables** | Las acciones Vuex y las rutas públicas de la API interna (mock) mantienen firmas predecibles; los cambios internos no rompen a los consumidores (vistas, componentes). |
| **Radio de impacto acotado** | Cada cambio debe poder revertirse o aislar su fallo (feature flags ligeros, ramas cortas, commits atómicos). |
| **Separación de capas** | Presentación (vistas), orquestación (Vuex), acceso a datos (servicio auth / futuro HTTP) y persistencia (`localStorage`) con fronteras claras. |
| **Seguridad proporcional** | En cliente, asumir que todo es visible; no confundir “mock” con “seguro”. Mejoras de hashing o tokens son **defensa en profundidad pedagógica**, no sustituto de backend. |
| **Observabilidad mínima** | Errores de login/registro y fallos de persistencia registrables en consola solo en desarrollo; en producción, mensajes de usuario sin filtrar detalles internos. |

---

## 2. Priorización (matriz esfuerzo / riesgo / valor)

Orden sugerido para trabajo incremental sin bloquear la entrega académica:

1. **Alta prioridad, bajo riesgo:** accesibilidad básica en formularios y botones críticos; validación de entrada en registro; mensajes de error uniformes.
2. **Media prioridad:** capa de abstracción sobre el mock (`authRepository`) lista para sustituir por `axios` sin tocar el store; tests unitarios del store y del guard del router.
3. **Media-baja:** división del store en módulos si el tamaño del archivo dificulta el mantenimiento; lazy loading de rutas en el router.
4. **Baja prioridad / deuda técnica:** migración opcional a TypeScript; ESLint/Prettier estrictos en CI.

---

## 3. Líneas de mejora (vista senior)

### 3.1 Autenticación y datos

- **Problema:** persistencia de credenciales en claro en `localStorage` para usuarios registrados es aceptable solo en demo; escala mal y educa mal sobre riesgo.
- **Dirección:** función única de “registro” que derive un hash unidireccional en cliente (Web Crypto) o, si se introduce backend, delegar verificación al servidor. El **mock actual** puede seguir siendo el backend por defecto detrás del mismo contrato `login(credentials) -> Result<User>`.
- **Criterio de aceptación:** la rúbrica sigue cumpliéndose; las vistas no conocen si hay hash o texto en almacenamiento.

### 3.2 Capa HTTP (Axios u otro cliente)

- **Problema:** acoplar `axios` en acciones Vuex complica tests y sustitución.
- **Dirección:** módulo `src/services/authApi.js` (o nombre equivalente) que exporta `signIn`, `signUp` implementadas hoy con el mock y mañana con `fetch`/`axios`. Las **actions** solo despachan según el resultado tipado (éxito / error de negocio / error de red).
- **Criterio de aceptación:** sustituir implementación sin cambiar `store` más que líneas de import.

### 3.3 Experiencia de usuario y accesibilidad

- **Problema:** estados de carga y errores inconsistentes degradan percepción de calidad y excluyen a usuarios de teclado/lectores.
- **Dirección:** reglas mínimas WCAG en formularios (`label`/`id`, foco visible, `aria-busy` en envío); feedback no intrusivo en favoritos (`aria-live` discreto).
- **Criterio de aceptación:** mismos flujos funcionales; mejora medible con checklist manual o auditoría ligera.

### 3.4 Router y seguridad de navegación

- El parámetro `redirect` tras login se valida con `src/utils/sanitizeRedirectPath.js` en `Login.vue` y `Registro.vue` (rutas internas únicamente).
- **Dirección adicional:** documentar en `router/index.js` el orden de guards (`requiresAuth` vs `guestOnly`).

### 3.5 Calidad automatizada

- **Problema:** cambios en mutations/actions son regresiones frecuentes sin tests.
- **Dirección:** Vitest + pruebas de: `SET_USER` / `CLEAR_USER`, `toggleFavorite`, y función pura del guard (mock de store).
- **Criterio de aceptación:** pipeline local `npm run test` opcional; no bloquea entrega académica si no está en el enunciado.

### 3.6 Rendimiento de entrega front

- **Problema:** bundle inicial innecesariamente grande si todas las vistas se cargan al inicio.
- **Dirección:** `import()` en definición de rutas para vistas de auth y área privada.
- **Criterio de aceptación:** mismas rutas y mismos guards; mejora medible en tamaño de chunk inicial (build report).

---

## 4. Lo que no se negocia (rúbrica)

- Vuex como fuente de verdad de sesión, preferencias y favoritos para el usuario autenticado.
- Rutas `/login`, `/registro` y al menos una ruta protegida con guard basado en autenticación.
- README con descripción del modelo de usuario, rutas relacionadas, instrucciones de ejecución y enlace a repositorio público (actualizable por el alumno).

Cualquier mejora que **elimine** o **sustituya** esos puntos por alternativas no equivalentes debe rechazarse o replantearse como extensión opcional documentada aparte.

---

## 5. Gobierno de cambios

- **Commits:** mensajes imperativos, alcance único (`feat`, `fix`, `docs`, `test`, `refactor`).
- **Revisiones:** auto-revisión con checklist: ¿rompe la rúbrica? ¿hay fallback? ¿documentación tocada?
- **Versionado:** semver en `package.json` solo si el equipo acuerda releases; para portafolio académico basta incremento manual en entregas formales.

---

**Responsabilidad:** este enfoque es una guía de ingeniería; la implementación concreta se integra por tareas pequeñas encima del código existente sin degradar los entregables obligatorios del módulo.
