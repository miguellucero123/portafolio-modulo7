# 4. Cierre de entregable — versión portafolio

## 4.1 Definición de “versión final” para portafolio profesional

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

## 4.2 Checklist de presentación

- [ ] URL en vivo (Netlify) o captura de pantalla en README.
- [ ] README con: qué hace la app, cómo ejecutarla, enlace a GitHub.
- [ ] Demostración en 2–3 minutos: login demo → favoritos → preferencias → logout.
- [ ] Mencionar explícitamente limitación (mock, sin backend) si la audiencia es técnica.

## 4.3 Artefactos de entrega académica

| Artefacto | Ubicación |
|-----------|-----------|
| Código fuente | `src/`, raíz del proyecto |
| ZIP “solo rúbrica” (opcional) | Script `scripts/extraer-rubrica-m7.ps1` → `documentacion/RUBRICA_M7_CONTENIDO/entrega/` |
| ZIP completo (opcional) | `scripts/empaquetar-portafolio-m7.ps1` → `documentacion/portafolio-m7/` |

## 4.4 Mantenimiento posterior al curso

| Acción | Frecuencia sugerida |
|--------|---------------------|
| `npm audit` + actualizar Vite/Vue menores | Trimestral o al cambiar Node |
| Revisar enlace GitHub y dominio Netlify | Al actualizar CV |
| Añadir tests si el proyecto evoluciona | Antes de incluir en CV “senior” |

## 4.5 Cierre

El producto **ClimaTorre** (rama `main`, `portafolio-modulo7`) está en condiciones de **mostrarse como pieza de portafolio** dentro del alcance académico descrito. Las iteraciones futuras (API real, tests, i18n) pueden documentarse como **fase 2** sin invalidar esta versión.

---

*Fecha de referencia documental: marzo 2026 (ajustar si el curso corresponde a otro período).*
