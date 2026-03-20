# Módulo 7 — Carpeta de entrega y dependencias

Esta carpeta reúne **la documentación de requisitos**, el **listado de dependencias npm** y los **manifiestos** (`package.json` / `package-lock.json`) para reproducir el entorno del proyecto **ClimaTorre** sin ambigüedad.

La comprobación punto por punto frente al enunciado está en la raíz del repositorio: [`../RUBRICA_CUMPLIMIENTO.md`](../RUBRICA_CUMPLIMIENTO.md).

El **código fuente** de la aplicación está en la raíz del repositorio (`src/`, `index.html`, `vite.config.js`, etc.). Aquí no se duplica todo el código: se documenta qué cumple la rúbrica y cómo instalar dependencias.

## Contenido

| Archivo / carpeta | Propósito |
|-------------------|-----------|
| [01_LEEME_PRIMERO.md](./01_LEEME_PRIMERO.md) | Cómo usar esta carpeta y orden sugerido de lectura |
| [02_REQUISITOS_RUBRICA.md](./02_REQUISITOS_RUBRICA.md) | Rúbrica M7 completa con criterio → evidencia en el proyecto |
| [03_DEPENDENCIAS_NPM.md](./03_DEPENDENCIAS_NPM.md) | Paquetes directos y rol de cada uno respecto a la rúbrica |
| [04_MAPA_CODIGO_REQUISITOS.md](./04_MAPA_CODIGO_REQUISITOS.md) | Rutas, store, servicios y vistas clave |
| [05_OPCIONAL_MEJORAS_ENFOQUE_SENIOR.md](./05_OPCIONAL_MEJORAS_ENFOQUE_SENIOR.md) | Opcional: evolución del código tras la rúbrica (no exigido) |
| `dependencias_manifiestos/` | Copia de `package.json` y `package-lock.json` para `npm ci` / `npm install` |
| `scripts/` | Scripts para instalar dependencias desde la raíz del repo |

## Instalación rápida de dependencias (desde la raíz del repo)

En la carpeta **padre** de esta carpeta (`modulo7_portafolio/`):

```bash
npm install
```

O instalación **reproducible** usando el lockfile:

```bash
npm ci
```

En Windows puedes ejecutar `scripts\instalar_dependencias.bat` (desde `MODULO7_ENTREGA`).

## Requisito de entrega (ZIP)

Para la entrega académica, comprime el **proyecto completo** (incluyendo `src/`, configuración y, si tu docente lo permite, **sin** `node_modules` para reducir tamaño; basta con `package-lock.json` + `npm install`). Incluye este directorio `MODULO7_ENTREGA/` dentro del ZIP como **anexo de requisitos y dependencias**.
