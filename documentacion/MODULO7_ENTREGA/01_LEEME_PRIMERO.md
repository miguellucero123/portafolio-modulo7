# 01 — Léeme primero (Módulo 7)

## Qué es esta carpeta

`MODULO7_ENTREGA` no sustituye al proyecto: es un **anexo** que concentra:

1. La **rúbrica** y cómo se cumple en ClimaTorre.
2. Las **dependencias npm** declaradas y su relación con Vue, Router, Vuex, Vite, etc.
3. Los **manifiestos** en `dependencias_manifiestos/` para auditoría o copia a otro equipo.

## Orden sugerido

1. `02_REQUISITOS_RUBRICA.md` — verificar criterios de evaluación.
2. `03_DEPENDENCIAS_NPM.md` — ver paquetes y versiones declaradas.
3. `04_MAPA_CODIGO_REQUISITOS.md` — localizar archivos en el repo.
4. Raíz del proyecto: ejecutar `npm install` y `npm run dev` (puerto configurado en `vite.config.js`, p. ej. 5174).

## Herramientas necesarias

- **Node.js** 18 LTS o superior (recomendado).
- **npm** incluido con Node.

## Nota sobre Git / GitHub

La rúbrica pide **commits descriptivos** y enlace al repositorio en el `README.md` principal del proyecto. Mantén el historial en Git y publica en un repo público cuando corresponda.

## Si algo no instala

- Borra `node_modules` y vuelve a ejecutar `npm install`.
- Usa `npm ci` solo si tienes el `package-lock.json` intacto (está en la raíz y copiado en `dependencias_manifiestos/`).
