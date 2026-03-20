# 🚀 Instrucciones de Ejecución - ClimaTorre Vue SPA

## Módulo 6 - Aplicación SPA con Vue.js

---

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** versión 16 o superior
- **npm** versión 8 o superior

### Verificar instalación:
```bash
node --version   # Debe mostrar v16.x.x o superior
npm --version    # Debe mostrar 8.x.x o superior
```

---

## 🔧 Instalación

### 1. Clonar o descargar el repositorio

Si estás trabajando desde GitHub:
```bash
git clone https://github.com/miguellucero123/weather-frontend-m3.git
cd modulo6_portafolio
```

Si ya tienes el proyecto descargado:
```bash
cd modulo6_portafolio
```

### 2. Instalar dependencias

```bash
npm install
```

**Tiempo estimado:** 30-60 segundos

**Dependencias que se instalarán:**
- Vue.js 3.4.15
- Vue Router 4.2.5
- Vite 5.0.12
- @vitejs/plugin-vue 5.0.3

### 3. Verificar instalación

Si la instalación fue exitosa, deberías ver:
```
added 32 packages, and audited 50 packages in Xs

10 packages are looking for funding
  run `npm fund` for details
```

**Nota:** Es normal ver algunas vulnerabilidades moderadas. No afectan el funcionamiento del proyecto.

---

## ▶️ Ejecutar la Aplicación

### Modo Desarrollo

```bash
npm run dev
```

**Resultado esperado:**
```
VITE v5.0.12  ready in XXX ms

➜  Local:   http://localhost:5174/
➜  Network: http://192.168.X.X:5174/
➜  press h to show help
```

### Acceder a la aplicación

1. **Automático:** El navegador debería abrirse automáticamente
2. **Manual:** Abre tu navegador y ve a: `http://localhost:5174/`

---

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos de la Rúbrica Cumplidos

#### 1. **Estructura SPA con Vue.js**
- ✅ Aplicación de una sola página (no recarga)
- ✅ Componente raíz `App.vue`
- ✅ Punto de entrada `main.js`

#### 2. **Vistas Principales**
- ✅ **Home** (`/`) - Listado de 6 lugares con clima
- ✅ **Detalle** (`/lugar/:id`) - Pronóstico completo de 7 días

#### 3. **Vue Router**
- ✅ Ruta estática: `/` para Home
- ✅ Ruta dinámica: `/lugar/:id` para Detalle
- ✅ Navegación sin recarga con `<router-link>`
- ✅ Vista renderizada con `<router-view>`

#### 4. **Templates y Directivas Vue**
- ✅ Interpolación: `{{ nombre }}`, `{{ temperatura }}`
- ✅ `v-for`: Renderizado de listas de lugares y días
- ✅ `v-if/v-show`: Renderizado condicional (sin resultados, errores)
- ✅ `v-model`: Búsqueda de lugares, selector de temperatura
- ✅ Eventos: `@click`, `@submit` para interacciones

#### 5. **Componentes**
- ✅ `App.vue` - Componente raíz con navbar y footer
- ✅ `Home.vue` - Vista de listado
- ✅ `LugarDetalle.vue` - Vista de detalle
- ✅ `PlaceCard.vue` - Componente reutilizable

#### 6. **Interactividad con v-model**
- ✅ Búsqueda en tiempo real de lugares
- ✅ Selector de unidad de temperatura (°C/°F)
- ✅ Filtros por circuito (W, O, Todos)
- ✅ Ordenamiento de lugares

#### 7. **Datos y Estado**
- ✅ `data()` para estado local en componentes
- ✅ Computed properties para datos derivados
- ✅ Props para comunicación entre componentes
- ✅ Watchers para observar cambios

---

## 🗺️ Navegación de la Aplicación

### Flujo de Usuario

```
┌─────────────────────────────────────┐
│  1. Página de Inicio (/)            │
│  - Ver 6 lugares de Torres del Paine│
│  - Buscar por nombre/descripción    │
│  - Filtrar por circuito W u O       │
│  - Ordenar por nombre o temperatura │
│  - Cambiar unidad °C ↔ °F           │
└─────────────────────────────────────┘
              │
              ▼ Click en tarjeta de lugar
┌─────────────────────────────────────┐
│  2. Detalle (/lugar/1)              │
│  - Clima actual del lugar           │
│  - Pronóstico de 7 días             │
│  - Estadísticas de la semana        │
│  - Recomendaciones de equipo        │
│  - Volver al inicio ←               │
└─────────────────────────────────────┘
```

### Ejemplos de Rutas

- **Home:** `http://localhost:5174/`
- **Base Torres:** `http://localhost:5174/lugar/1`
- **Glaciar Grey:** `http://localhost:5174/lugar/2`
- **Valle del Francés:** `http://localhost:5174/lugar/3`
- **Refugio Paine Grande:** `http://localhost:5174/lugar/4`
- **Campamento Italiano:** `http://localhost:5174/lugar/5`
- **Los Cuernos:** `http://localhost:5174/lugar/6`

---

## 🧪 Probar Funcionalidades

### 1. Búsqueda con v-model (Home)
1. En la página de inicio
2. Escribe en el buscador: "glaciar"
3. ✅ Debería filtrar y mostrar solo "Glaciar Grey"

### 2. Filtro por Circuito (Home)
1. Click en botón "Circuito W"
2. ✅ Debería mostrar solo lugares del circuito W (5 lugares)

### 3. Selector de Temperatura (Global)
1. Click en el botón "°F" en el navbar
2. ✅ Todas las temperaturas cambian a Fahrenheit
3. ✅ La preferencia se guarda (recargar y verifica)

### 4. Navegación entre Vistas
1. Click en cualquier tarjeta de lugar
2. ✅ Navega a la vista detalle SIN recargar la página
3. ✅ URL cambia a `/lugar/X`
4. Click en "← Volver al inicio"
5. ✅ Regresa al Home sin recargar

### 5. Ordenamiento (Home)
1. Selecciona "Temperatura (mayor a menor)" en el dropdown
2. ✅ Los lugares se reordenan dinámicamente

### 6. Tema Claro/Oscuro
1. Click en el botón 🌙 (navbar)
2. ✅ Cambia a modo oscuro
3. ✅ Preferencia se guarda en localStorage

---

## 📦 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Previsualiza el build de producción |

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'vue'"
**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5174 is already in use"
**Solución 1:** Cerrar otras aplicaciones en ese puerto
**Solución 2:** Cambiar el puerto en `vite.config.js`:
```javascript
server: {
  port: 3001, // Cambiar al puerto deseado
  open: true
}
```

### Error: "Failed to resolve import"
**Solución:** Verifica que los alias en `vite.config.js` estén correctos y que los archivos existan en:
- `src/views/`
- `src/components/`
- `src/data/`
- `src/utils/`
- `src/router/`

### Página en blanco al ejecutar
**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica errores
3. Asegúrate de que `index.html` apunte a `/src/main.js`

---

## 📁 Estructura de Archivos

```
modulo6_portafolio/
├── src/
│   ├── App.vue                    # Componente raíz
│   ├── main.js                    # Punto de entrada
│   ├── components/
│   │   └── PlaceCard.vue          # Tarjeta de lugar
│   ├── views/
│   │   ├── Home.vue               # Vista listado
│   │   └── LugarDetalle.vue       # Vista detalle
│   ├── router/
│   │   └── index.js               # Configuración Vue Router
│   ├── data/
│   │   └── lugares.js             # Datos de lugares
│   ├── utils/
│   │   └── helpers.js             # Funciones auxiliares
│   └── assets/
│       └── styles/
│           └── main.css           # Estilos globales
├── index.html                     # HTML principal
├── vite.config.js                 # Configuración Vite
├── package.json                   # Dependencias
└── README.md                      # Documentación
```

---

## 🎯 Checklist de Verificación

Antes de entregar el proyecto, verifica:

### Funcionalidades
- [ ] La aplicación corre con `npm run dev`
- [ ] Home muestra al menos 5 lugares
- [ ] Se puede navegar al detalle de un lugar
- [ ] La búsqueda filtra en tiempo real
- [ ] El selector °C/°F funciona
- [ ] El pronóstico de 7 días se muestra correctamente
- [ ] Las estadísticas se calculan bien
- [ ] La navegación no recarga la página

### Código Vue
- [ ] Usa `{{ }}` para interpolación
- [ ] Usa `v-for` para listas
- [ ] Usa `v-if/v-show` para condicionales
- [ ] Usa `v-model` al menos una vez
- [ ] Usa `@click`, `@submit` para eventos
- [ ] Vue Router está configurado
- [ ] Tiene al menos 3 componentes

### Documentación
- [ ] README.md actualizado
- [ ] Instrucciones de ejecución claras
- [ ] Descripción de vistas y rutas
- [ ] Enlace al repositorio GitHub

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa la consola del navegador** (F12)
2. **Revisa la terminal** donde corre `npm run dev`
3. **Verifica que todas las dependencias estén instaladas**
4. **Asegúrate de usar Node.js 16+**

---

## ✅ Proyecto Listo para Entregar

Si todos los puntos del checklist están marcados, tu proyecto cumple con los requisitos del Módulo 6 y está listo para la entrega.

**¡Éxito con tu presentación! 🎉**

---

**Última actualización:** Febrero 2026  
**Versión:** 2.0.0 (Módulo 6 - Vue.js SPA)
