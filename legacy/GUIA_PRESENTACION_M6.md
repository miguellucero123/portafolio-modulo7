# 🎤 GUÍA DE PRESENTACIÓN - MÓDULO 6

## ClimaTorre - SPA con Vue.js
### Torres del Paine Weather Application

---

## 📊 ESTRUCTURA DE PRESENTACIÓN (10-15 minutos)

### 1. INTRODUCCIÓN (2 minutos)

#### Saludo y Contexto
```
"Buenos días/tardes. Mi nombre es [Tu Nombre] y hoy les presento 
ClimaTorre, una aplicación web desarrollada como Single Page Application 
(SPA) utilizando Vue.js 3."
```

#### Temática del Proyecto
```
"La aplicación está enfocada en proporcionar información meteorológica 
de los principales puntos de los Circuitos W y O de Torres del Paine, 
uno de los destinos de trekking más importantes de la Patagonia chilena."
```

#### Objetivo
```
"El objetivo es demostrar el dominio de Vue.js como framework progresivo, 
implementando componentes reutilizables, navegación SPA con Vue Router, 
reactividad de datos y directivas como v-model, v-for y v-if."
```

---

### 2. DEMOSTRACIÓN EN VIVO (5-7 minutos)

#### 🎬 Script de Demostración

**Paso 1: Mostrar Vista Home**
```
"Aquí tenemos la vista principal donde se muestran 6 lugares diferentes 
de los circuitos W y O. Cada tarjeta muestra:
- Nombre del lugar
- Temperatura actual  
- Estado climático
- Circuito al que pertenece
- Altitud y dificultad
- Rango de temperaturas de la semana"
```

**Paso 2: Demostrar Búsqueda (v-model)**
```
"Una de las características clave es la búsqueda en tiempo real. 
Utilizando v-model para two-way data binding, puedo buscar lugares...

[Escribir 'glaciar' en el buscador]

Como pueden ver, la lista se filtra automáticamente mostrando solo 
el Glaciar Grey. Esto es reactividad de Vue en acción."
```

**Paso 3: Demostrar Filtros**
```
"También tenemos filtros por circuito...

[Click en 'Circuito W']

Ahora solo se muestran lugares del circuito W. 

[Click en 'Todos']

Y volvemos a ver todos los lugares."
```

**Paso 4: Demostrar Selector de Temperatura**
```
"El selector de unidad de temperatura es global. Actualmente está en Celsius...

[Click en °F]

Y ahora todas las temperaturas cambiaron a Fahrenheit. Esta preferencia 
se guarda en localStorage, así que persiste entre sesiones."
```

**Paso 5: Navegación a Detalle**
```
"Ahora voy a seleccionar un lugar para ver su detalle...

[Click en tarjeta de 'Base Torres']

Observen que la URL cambió a /lugar/1 pero la página NO se recargó. 
Esto es navegación SPA con Vue Router."
```

**Paso 6: Vista Detalle**
```
"En la vista de detalle tenemos:

1. CLIMA ACTUAL: Temperatura y estado en tiempo real

2. ESTADÍSTICAS SEMANALES: 
   - Temperatura mínima: 3°C
   - Temperatura máxima: 14°C
   - Temperatura promedio: 8.5°C
   - Estado más frecuente
   Estas estadísticas se calculan automáticamente usando computed properties

3. PRONÓSTICO 7 DÍAS:
   [Click en botón 'Tabla']
   Puedo cambiar entre vista de tarjetas y tabla sin recargar datos

4. DISTRIBUCIÓN DE ESTADOS:
   Gráfico visual que muestra cuántos días de cada estado climático

5. RECOMENDACIONES:
   Sistema inteligente que sugiere equipo según las condiciones"
```

**Paso 7: Navegación de Regreso**
```
"Para volver al inicio...

[Click en '← Volver al inicio']

Nuevamente, navegación sin recarga. La experiencia es fluida y rápida."
```

**Paso 8: Tema Oscuro (Opcional)**
```
"Como bonus, implementé un tema oscuro...

[Click en botón luna]

Todos los colores cambian y la preferencia también se guarda."
```

---

### 3. ASPECTOS TÉCNICOS (4-5 minutos)

#### 📋 Checklist de Requisitos Cumplidos

**Menciona mientras muestras el código (brevemente):**

```
"Ahora permítanme mostrarles cómo se cumplieron los requisitos técnicos:"
```

#### A. Estructura de Componentes
```
"La aplicación está dividida en 4 componentes principales:

1. App.vue - Componente raíz con navbar y footer
2. Home.vue - Vista de listado
3. LugarDetalle.vue - Vista de detalle  
4. PlaceCard.vue - Componente reutilizable para cada tarjeta"

[Mostrar brevemente App.vue en el editor]
```

#### B. Vue Router
```
"Configuré Vue Router con:
- Ruta estática '/' para Home
- Ruta dinámica '/lugar/:id' para Detalle
- Manejo de rutas no encontradas (404)"

[Mostrar src/router/index.js]
```

#### C. Directivas Vue
```
"Utilicé todas las directivas requeridas:

v-model: Para búsqueda y selectores
[Mostrar línea en Home.vue: <input v-model="searchQuery">]

v-for: Para renderizar listas
[Mostrar: v-for="lugar in lugaresFiltrados"]

v-if/v-show: Para renderizado condicional  
[Mostrar: v-if="lugaresFiltrados.length === 0"]

@click: Para eventos
[Mostrar: @click="circuitoFiltro = 'W'"]

Interpolación: Para mostrar datos
[Mostrar: {{ lugar.nombre }}]
```

#### D. Reactividad y Estado
```
"Implementé:
- data() para estado local en cada componente
- Computed properties para cálculos derivados (temperaturaPromedio, estadisticas)
- Watchers para observar cambios (tempUnit → localStorage)
- Props para comunicación entre componentes"

[Mostrar un computed property en Home.vue]
```

---

### 4. DATOS Y FUENTE (1 minuto)

```
"Los datos de los lugares están en src/data/lugares.js. Incluye:
- 6 lugares de Torres del Paine
- Pronóstico de 7 días para cada uno
- Información de circuito, altitud, dificultad y coordenadas

En un escenario real, estos datos vendrían de una API como Open-Meteo."
```

---

### 5. ESTRUCTURA DEL PROYECTO (1 minuto)

```
"La estructura sigue las mejores prácticas de Vue:

src/
  ├── components/    # Componentes reutilizables
  ├── views/         # Vistas de rutas
  ├── router/        # Configuración de rutas
  ├── data/          # Datos mock
  ├── utils/         # Funciones auxiliares
  └── assets/        # Estilos globales

Utilizamos Vite como build tool por su velocidad y hot-reload instantáneo."
```

---

### 6. CONCLUSIÓN (1 minuto)

```
"En resumen, ClimaTorre es una SPA completa que demuestra:

✅ Dominio de Vue.js 3
✅ Navegación con Vue Router
✅ Componentes reutilizables
✅ Reactividad con v-model
✅ Directivas (v-for, v-if, v-show)
✅ Event handling (@click)
✅ Computed properties y watchers
✅ UI/UX profesional y responsive

El proyecto cumple al 100% con los requisitos del Módulo 6 y está 
listo para producción.

¿Tienen alguna pregunta?"
```

---

## 🎯 PUNTOS CLAVE A DESTACAR

### Durante la Demostración

1. **Reactividad de Vue**
   - "Observen cómo al escribir en el buscador, los resultados se actualizan inmediatamente"
   - "Esto es posible gracias al sistema de reactividad de Vue"

2. **Navegación SPA**
   - "Noten que la página NUNCA se recarga"
   - "La URL cambia pero la experiencia es instantánea"
   - "Esto mejora significativamente la experiencia del usuario"

3. **Componentes Reutilizables**
   - "PlaceCard se usa 6 veces pero solo lo escribí una vez"
   - "Recibe props diferentes y se renderiza dinámicamente"

4. **Computed Properties**
   - "Las estadísticas se recalculan automáticamente"
   - "Si cambio los datos, las estadísticas se actualizan solas"

5. **Persistencia**
   - "Las preferencias del usuario se guardan en localStorage"
   - "Si refresco la página, mantiene el tema y la unidad de temperatura"

---

## ❓ PREGUNTAS FRECUENTES Y RESPUESTAS

### Pregunta 1: "¿Por qué usaste Vue.js y no React o Angular?"
**Respuesta:**
```
"Vue.js fue elegido por su curva de aprendizaje suave y su enfoque 
progresivo. Además, su documentación es excelente y tiene un ecosistema 
maduro con Vue Router y Vite. Para este proyecto, Vue ofrece toda la 
potencia necesaria siendo más simple que Angular y más intuitivo que React."
```

### Pregunta 2: "¿Los datos son reales?"
**Respuesta:**
```
"Para este módulo, utilicé datos mock estáticos en un archivo JavaScript. 
Sin embargo, la estructura está preparada para conectarse a una API real 
como Open-Meteo. En el Módulo 5 trabajé con API real, pero aquí el foco 
es la arquitectura de componentes y Vue Router."
```

### Pregunta 3: "¿Es responsive?"
**Respuesta:**
```
"Sí, completamente. Utilicé CSS Grid y Flexbox con media queries. 
[Mostrar DevTools responsive mode]
Como pueden ver, se adapta perfectamente a mobile, tablet y desktop."
```

### Pregunta 4: "¿Qué tan escalable es el proyecto?"
**Respuesta:**
```
"Muy escalable. La estructura modular permite:
- Agregar nuevos lugares fácilmente al array de datos
- Crear nuevas vistas sin afectar las existentes
- Reutilizar componentes en otros contextos
- Integrar Vuex o Pinia para state management si crece
- Conectar a una API real sin cambiar la estructura"
```

### Pregunta 5: "¿Tiene tests?"
**Respuesta:**
```
"Para este módulo no se requirió testing, pero la estructura está 
preparada para agregar Vitest o Jest. Los componentes están bien 
aislados, lo que facilita escribir tests unitarios."
```

---

## 📸 ORDEN DE CAPTURAS/SLIDES (Opcional)

Si haces slides, sigue este orden:

1. **Slide Título**
   - ClimaTorre
   - Subtítulo: SPA con Vue.js para Torres del Paine
   - Tu nombre

2. **Slide Contexto**
   - ¿Qué es Torres del Paine?
   - Circuitos W y O
   - Importancia del clima en trekking

3. **Slide Tecnologías**
   - Vue.js 3.4
   - Vue Router 4.2
   - Vite 5.0
   - JavaScript ES6+

4. **Slide Arquitectura**
   - Diagrama de componentes
   - Flujo de navegación

5. **Demo en Vivo** (sin slides, mostrar aplicación)

6. **Slide Código Destacado**
   - Ejemplo de v-model
   - Ejemplo de computed property
   - Ejemplo de Vue Router

7. **Slide Cumplimiento de Requisitos**
   - Checklist visual con ✅

8. **Slide Conclusión**
   - Logros del proyecto
   - Aprendizajes clave

---

## ⏱️ GESTIÓN DEL TIEMPO

| Sección | Tiempo | Notas |
|---------|--------|-------|
| Introducción | 2 min | Breve pero clara |
| Demo en Vivo | 6 min | Lo más importante |
| Aspectos Técnicos | 4 min | Mostrar código brevemente |
| Datos y Estructura | 1 min | Solo mencionar |
| Conclusión | 1 min | Resumen potente |
| Preguntas | 3-5 min | Depende de la audiencia |
| **TOTAL** | **14-19 min** | Ideal: 15 minutos |

---

## 🎬 ENSAYO DE LA PRESENTACIÓN

### Antes de Presentar

**Checklist de Preparación:**

- [ ] Servidor corriendo (`npm run dev`)
- [ ] Navegador abierto en `http://localhost:5173`
- [ ] DevTools cerradas inicialmente (abrir si preguntan)
- [ ] Editor de código abierto en otra ventana
- [ ] README.md accesible para referencia
- [ ] Internet funcionando (por si acaso)
- [ ] Ensayado al menos 2 veces
- [ ] Tiempo cronometrado

**Ensayo:**
1. Practica en voz alta
2. Cronometra cada sección
3. Ajusta según el tiempo disponible
4. Prepara respuestas a preguntas comunes

---

## 💡 TIPS DE PRESENTACIÓN

### ✅ Hacer

- ✅ Hablar con claridad y confianza
- ✅ Hacer contacto visual con la audiencia
- ✅ Mostrar entusiasmo por tu proyecto
- ✅ Destacar puntos técnicos clave
- ✅ Mencionar desafíos superados
- ✅ Agradecer al final

### ❌ Evitar

- ❌ Leer diapositivas palabra por palabra
- ❌ Hablar muy rápido por nervios
- ❌ Disculparse por "no haber hecho más"
- ❌ Pasar demasiado tiempo en un detalle
- ❌ Olvidar mencionar Vue Router (es clave)
- ❌ No probar la demo antes de presentar

---

## 🎤 FRASES DE IMPACTO

Usa estas frases para destacar aspectos técnicos:

1. **Reactividad:**
   > "La magia de Vue es que los datos y la UI están siempre sincronizados"

2. **SPA:**
   > "Una vez cargada, la aplicación nunca necesita recargar la página"

3. **Componentes:**
   > "Escribir una vez, usar muchas veces. Eso es reutilización de código"

4. **Vue Router:**
   > "La navegación es tan fluida que parece una aplicación nativa"

5. **v-model:**
   > "Two-way binding: lo que el usuario escribe se refleja instantáneamente"

---

## 📝 SCRIPT COMPLETO (Memorizar puntos clave)

```
[INICIO]
"Buenos días/tardes. Les presento ClimaTorre, una SPA con Vue.js para 
consultar el clima de Torres del Paine..."

[DEMO]
"Permítanme mostrarles cómo funciona en vivo..."

[TÉCNICO]
"A nivel técnico, implementé todos los requisitos..."

[CONCLUSIÓN]
"En resumen, un proyecto completo que demuestra dominio de Vue.js..."

[CIERRE]
"Muchas gracias. ¿Tienen alguna pregunta?"
```

---

## 🏆 CIERRE POTENTE

```
"ClimaTorre no es solo un proyecto académico. Es una demostración de 
cómo Vue.js permite crear aplicaciones web modernas, rápidas y escalables.

Cumple con cada requisito del Módulo 6, pero va más allá al implementar:
- UI profesional
- Persistencia de preferencias
- Reactividad avanzada
- Código limpio y documentado

Estoy orgulloso de este resultado y listo para aplicar estos conocimientos 
en proyectos más grandes.

¿Preguntas?"
```

---

## ✅ CHECKLIST FINAL PRE-PRESENTACIÓN

**30 minutos antes:**
- [ ] Servidor corriendo sin errores
- [ ] Todos los enlaces funcionan
- [ ] Búsqueda, filtros y selectores funcionan
- [ ] Navegación Home ↔ Detalle funciona
- [ ] Tema oscuro funciona
- [ ] Responsive funciona (probar en DevTools)

**10 minutos antes:**
- [ ] Reiniciar aplicación (`Ctrl+C` y `npm run dev`)
- [ ] Abrir en ventana limpia del navegador
- [ ] Cerrar pestañas innecesarias
- [ ] Conectar proyector/compartir pantalla
- [ ] Verificar audio/video

**Al inicio:**
- [ ] Respirar profundo
- [ ] Sonreír
- [ ] Presentarte con confianza

---

**¡MUCHO ÉXITO EN TU PRESENTACIÓN! 🚀**

Tu proyecto está completo, profesional y cumple todos los requisitos. 
Confía en tu trabajo y muéstralo con orgullo.

---

**Guía creada para:** ClimaTorre Vue SPA  
**Módulo:** 6 - Aplicaciones SPA con Vue.js  
**Fecha:** Febrero 2026
