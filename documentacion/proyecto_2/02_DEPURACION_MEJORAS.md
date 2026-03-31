# 2. Depuración y mejora

## 2.1 Correcciones de código y estructura

| Problema detectado | Acción aplicada | Ubicación / referencia |
|--------------------|-------------------|-------------------------|
| Posible **open redirect** tras login vía `?redirect=` | Validación de ruta interna en utilidad dedicada | `src/utils/sanitizeRedirectPath.js`; uso en `Login.vue`, `Registro.vue` |
| Mutación **Vuex sin uso** | Eliminación de `SET_FAVORITE_IDS` (no referenciada) | `src/store/index.js` |
| **Código muerto / comentarios** en auth | Comentario alineado a rúbrica (mock permitido) | `src/services/authService.js` |
| **Enlace GitHub** en pie de página desactualizado | `App.vue` apunta a `portafolio-modulo7` | `src/App.vue` |
| **Vulnerabilidades** de dependencias (`esbuild`, `rollup`, `immutable`) | `npm audit fix` + subida a **Vite 6** | `package.json`, `package-lock.json` |
| **Duplicación** de entrega en repo | Carpetas `documentacion/portafolio-m7`, `documentacion/RUBRICA_M7_CONTENIDO` con scripts de empaquetado | `scripts/`, documentación |

## 2.2 Mejoras de usabilidad y presentación

| Mejora | Descripción |
|--------|-------------|
| **Coherencia de sesión** | Nombre de usuario y “Cerrar sesión” visibles en navbar; enlaces a favoritos y preferencias solo cuando aplica. |
| **Favoritos** | Botón en tarjeta y en detalle; estado visual (corazón) sincronizado con Vuex. |
| **Preferencias** | °C/°F y tema en store y página dedicada; navbar refleja preferencias. |
| **README** | Tono profesional, instrucciones de instalación, enlace a repositorio, sección Netlify. |
| **Pie de página** | Enlace a repositorio correcto; `rel="noopener noreferrer"` en enlaces externos. |

## 2.3 Eficiencia y operación

| Aspecto | Mejora |
|---------|--------|
| **Build** | Vite 6 mantiene tiempos de compilación adecuados; sin cambios de API en componentes. |
| **Despliegue** | `netlify.toml` + `public/_redirects` para SPA (history); evita 404 en rutas profundas. |
| **Seguridad de dependencias** | `npm audit` sin hallazgos tras actualización de toolchain. |
| **Entregas** | Scripts para ZIP completo y copia “solo rúbrica” reducen error humano al empaquetar. |

## 2.4 Lo que no se modificó (por decisión de alcance)

- **Backend real** de autenticación (fuera del alcance académico actual).
- **Suite de tests** (no exigida en el enunciado M7; coste de mantenimiento documentado en anexo).
- **Eliminación total** del código legacy en raíz (preservado en repo; excluido en entregas focalizadas).

## 2.5 Verificación post-mejoras

- `npm run build` exitoso.
- Flujo manual: login → favoritos → preferencias → logout → rutas protegidas redirigen a login.
