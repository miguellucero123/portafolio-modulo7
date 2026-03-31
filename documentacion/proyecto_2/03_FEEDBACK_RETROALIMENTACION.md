# 3. Incorporación de feedback

## 3.1 Propósito

Este apartado documenta **cómo** se integra la retroalimentación de **docentes** y **compañeros** en el producto. Las tablas incluyen **ejemplos genéricos** coherentes con un proyecto SPA Vue; debe **completarse** con el feedback concreto de cada evaluación.

---

## 3.2 Feedback docente

| Sugerencia recibida | ¿Se aplicó? | Cómo contribuye al producto |
|---------------------|-------------|-----------------------------|
| [COMPLETAR: ej. aclarar en README el uso de mock de auth] | Sí / Parcial / No | [COMPLETAR] |
| [COMPLETAR: ej. evidenciar rutas protegidas en documentación] | | |
| [COMPLETAR] | | |

**Notas:** [COMPLETAR: fechas, asignatura, nombre de quien retroalimenta si corresponde a la política del curso.]

---

## 3.3 Feedback de compañeros (revisión cruzada / pares)

| Sugerencia recibida | ¿Se aplicó? | Cómo contribuye al producto |
|---------------------|-------------|-----------------------------|
| [COMPLETAR: ej. mejorar visibilidad del botón de favoritos] | | |
| [COMPLETAR: ej. mensaje de error más claro en login] | | |
| [COMPLETAR] | | |

---

## 3.4 Ejemplos de integración ya reflejadas en el código (referencia)

Las siguientes mejoras son **típicas** de retroalimentación en proyectos similares y **ya están** incorporadas en este repositorio; sirven como modelo de respuesta en el informe:

| Tema de feedback | Respuesta en el producto |
|------------------|--------------------------|
| “El login debe redirigir sin volver a login en bucle” | Guard `requiresAuth` + `guestOnly` + `redirect` sanitizado. |
| “Las dependencias no deben mostrar vulnerabilidades graves al entregar” | Actualización a Vite 6 y `npm audit` limpio. |
| “El portafolio debe poder desplegarse” | Netlify documentado (`documentacion/tecnico/DEPLOY_NETLIFY.md`). |
| “La entrega debe ser trazable frente a la rúbrica” | `RUBRICA_CUMPLIMIENTO.md` y carpeta `MODULO7_ENTREGA/`. |

---

## 3.5 Feedback pendiente o no aplicado (transparencia)

| Sugerencia | Motivo de no aplicar aún | Próximo paso sugerido |
|------------|--------------------------|------------------------|
| [COMPLETAR] | | |
| Tests automatizados | Prioridad y tiempo de entrega | Añadir Vitest en iteración posterior |
| Backend real | Alcance M7 | Diseñar contrato API y sustituir `authService` |

---

*Instrucción para el alumno: reemplace los `[COMPLETAR]` tras cada revisión docente o de pares y mantenga este archivo como historial breve.*
