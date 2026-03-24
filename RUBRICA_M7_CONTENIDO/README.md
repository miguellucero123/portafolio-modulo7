# Contenido alineado solo con la rúbrica — Módulo 7

Esta carpeta documenta y permite **generar** una copia del proyecto que incluye **únicamente** lo necesario para cumplir el trabajo 7 según el enunciado (SPA Vue con autenticación, Vuex, rutas protegidas, personalización, README de entrega).

## Qué queda fuera de la copia “solo rúbrica”

No forma parte del entregable mínimo M7:

- Carpetas `CLON_PROYECTO_ORIGINAL/`, `backup/`, `js/`, `css/`, `scss/` en la raíz (código y estilos **legacy** HTML/JS, no usados por la SPA Vite).
- Archivos sueltos antiguos: `index-old.html`, `*.gpx`, `promt.txt`, guías M5/M6 sueltas, etc.
- `MODULO7_ENTREGA/05_OPCIONAL_MEJORAS_ENFOQUE_SENIOR.md` (material opcional posterior a la rúbrica).
- `node_modules/`, `dist/`, `.git/` (se excluyen siempre; tras descomprimir: `npm install`).

## Qué sí se incluye (copia generada)

| Ámbito | Contenido |
|--------|-----------|
| Aplicación Vue (M6 base + M7) | `src/`, `index.html`, `vite.config.js`, `public/` |
| Dependencias y build | `package.json`, `package-lock.json`, `netlify.toml`, `.gitignore` |
| Entrega académica | `README.md`, `RUBRICA_CUMPLIMIENTO.md` |
| Documentación M7 requerida | `MODULO7_ENTREGA/` (sin el archivo 05 opcional) |
| Utilidad | `docs/DEPLOY_NETLIFY.md`, `docs/GITHUB_SETUP_M7.md` |
| Scripts de empaquetado | `scripts/` (empaquetar + extraer) |

La rúbrica exige la SPA **sobre la base M6**; por eso se incluye **todo** `src/` (clima + usuarios), no solo los archivos de login.

## Generar la carpeta `entrega/`

Desde la **raíz del repositorio**:

```powershell
.\scripts\extraer-rubrica-m7.ps1
```

Se crea (o sobrescribe) **`RUBRICA_M7_CONTENIDO/entrega/`** con el árbol anterior. Luego puede comprimir solo esa carpeta en un ZIP para el docente.

La carpeta `entrega/` está en `.gitignore` para no duplicar el proyecto en Git.

## Ver documentación detallada

- [LISTADO_ARCHIVOS_RUBRICA_M7.md](./LISTADO_ARCHIVOS_RUBRICA_M7.md)
