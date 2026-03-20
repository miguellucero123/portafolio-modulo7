# 03 — Dependencias npm (Módulo 7)

Manifiestos oficiales: **`dependencias_manifiestos/package.json`** y **`dependencias_manifiestos/package-lock.json`** (copia de la raíz del repositorio).

## Dependencias de producción (`dependencies`)

| Paquete | Versión declarada | Rol respecto a la rúbrica |
|---------|-------------------|---------------------------|
| **vue** | ^3.4.15 | Framework SPA (componentes, `v-model`, vistas) |
| **vue-router** | ^4.2.5 | Rutas `/login`, `/registro`, guards, navegación |
| **vuex** | ^4.1.0 | Estado global: auth, preferencias, favoritos |
| **lucide-vue-next** | ^0.574.0 | Iconos en navbar y formularios (UI) |

## Dependencias de desarrollo (`devDependencies`)

| Paquete | Versión declarada | Rol |
|---------|-------------------|-----|
| **vite** | ^5.0.12 | Servidor de desarrollo y build |
| **@vitejs/plugin-vue** | ^5.0.3 | Soporte Vue SFC en Vite |
| **sass** | ^1.94.2 | Compilación SCSS (si se usa en scripts legacy `build-css`) |

## Dependencias transitivas

Instalar con `npm install` descarga automáticamente dependencias anidadas (p. ej. compiladores opcionales de Vite, utilidades de Vue). Las versiones exactas quedan fijadas en **`package-lock.json`**.

## Comandos

```bash
# Instalación estándar
npm install

# Instalación idéntica al lockfile (CI / reproducibilidad)
npm ci
```

## Matriz rúbrica ↔ paquetes

| Requisito académico | Cubierto por |
|---------------------|--------------|
| Vue SPA | `vue`, `vite`, `@vitejs/plugin-vue` |
| Vue Router | `vue-router` |
| Vuex | `vuex` |
| Axios *opcional* | No incluido: se usa mock en `authService.js` |

Si el curso **exige** Axios explícitamente, añade:

```bash
npm install axios
```

y adapta `authService.js` para usar `axios` en las llamadas (manteniendo la misma interfaz de retorno para el store).
