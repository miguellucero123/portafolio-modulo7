# 🚀 Cómo Probar las Nuevas Mejoras - Datos Horarios, Modelos y Históricos

## 📋 Preparación

1. **Asegúrate de que el servidor esté ejecutándose:**
   ```powershell
   python -m http.server 8000
   ```

2. **Abre tu navegador en:** http://localhost:8000

---

## 🎯 Funcionalidades Disponibles

### ✅ 1. Datos Horarios (YA ACTIVO)

**¿Qué verás?**
- En la vista de detalle de cualquier ciudad, verás una nueva sección: **"Pronóstico Horario (Próximas 24 horas)"**
- Un gráfico con dos líneas:
  - **Naranja**: Temperatura (°C) - Eje izquierdo
  - **Azul**: Precipitación (mm) - Eje derecho
- Datos actualizados cada hora desde la API

**Cómo probarlo:**
1. Abre la aplicación
2. Haz clic en cualquier ciudad (ej: "Torres del Paine - Glaciar Grey")
3. Desplázate hacia abajo después de las estadísticas
4. Deberías ver el gráfico de datos horarios

---

### ✅ 2. Datos Históricos (YA ACTIVO)

**¿Qué verás?**
- En la vista de detalle, sección: **"Tendencia Histórica"**
- Dos tarjetas:
  - Temperatura promedio de los últimos días
  - Días de pronóstico disponibles
- Gráfico que muestra:
  - Datos históricos (últimos 5 días)
  - Pronóstico futuro (próximos 7 días)
  - Línea vertical marcando "hoy"

**Cómo probarlo:**
1. Abre la aplicación
2. Haz clic en una ciudad
3. Desplázate hasta "Tendencia Histórica"
4. Verás el gráfico con datos históricos vs pronóstico

**Nota:** Los datos históricos se cargan automáticamente (5 días por defecto). Esto permite ver la tendencia pasada junto con el pronóstico futuro.

---

### 🔬 3. Múltiples Modelos Meteorológicos (OPCIONAL)

**¿Cómo activarlo?**

**Opción A: Modificar el código de inicialización**

Edita `js/app.js` línea 39:
```javascript
// Antes:
await weatherApp.cargarDatosClima();

// Después (para activar modelos):
await weatherApp.cargarDatosClima({
    includeHourly: true,
    includeModels: true,  // ← Activa los modelos
    pastDays: 7
});
```

**Opción B: Usar la consola del navegador (F12)**

1. Abre la consola (F12)
2. Ejecuta:
```javascript
// Cargar datos con modelos para una ciudad específica
weatherApp.cargarDetalleLugar('Torres del Paine - Glaciar Grey', {
    includeModels: true
}).then(() => {
    // Recargar la vista de detalle
    showDetail('Torres del Paine - Glaciar Grey');
});
```

**¿Qué verás?**
- Nueva sección: **"Comparación de Modelos Meteorológicos"**
- 3 tarjetas mostrando:
  - **ECMWF** (modelo europeo)
  - **GFS** (modelo estadounidense)
  - **ICON** (modelo alemán)
- Cada tarjeta muestra temperatura, humedad y viento según ese modelo
- Si hay diferencias significativas (>2°C), aparecerá una alerta

---

## 📊 Estructura de la Vista de Detalle

Al abrir el detalle de una ciudad, verás **en orden**:

1. **Información Actual** - Temperatura, humedad, viento actual
2. **Alertas de Clima** (si hay alguna activa)
3. **Pronóstico Semanal** - Cards con los próximos 7 días
4. **Estadísticas de la Semana** - Mín/máx/promedio y días por tipo de clima
5. **📈 Pronóstico Horario** - Gráfico de próximas 24 horas *(NUEVO)*
6. **📊 Tendencia Histórica** - Gráfico histórico vs pronóstico *(NUEVO)*
7. **🔬 Comparación de Modelos** - Solo si se habilitó `includeModels: true` *(NUEVO)*

---

## 🧪 Probar Cada Funcionalidad

### Prueba 1: Datos Horarios

1. Abre cualquier ciudad en detalle
2. Busca la sección "Pronóstico Horario (Próximas 24 horas)"
3. Verifica que el gráfico muestre:
   - Temperatura en naranja (eje izquierdo)
   - Precipitación en azul (eje derecho)
   - Etiquetas de horas en el eje X

### Prueba 2: Datos Históricos

1. Abre cualquier ciudad en detalle
2. Busca la sección "Tendencia Histórica"
3. Verifica:
   - Tarjetas con temperatura promedio histórica
   - Gráfico con datos históricos (izquierda) y pronóstico (derecha)
   - Línea vertical separando "histórico" de "pronóstico"

### Prueba 3: Modelos Múltiples

**Activar modelos:**

**Método rápido (Consola):**
1. Abre la consola (F12)
2. Ejecuta:
```javascript
// Cargar datos con modelos
weatherApp.cargarDetalleLugar('Torres del Paine - Glaciar Grey', {
    includeModels: true,
    includeHourly: true,
    pastDays: 7
}).then(() => {
    console.log('Datos con modelos cargados');
    // Ver los datos en consola
    const datos = weatherApp.obtenerDatosClima('Torres del Paine - Glaciar Grey');
    if (datos.models) {
        console.log('Modelos disponibles:', datos.models.length);
        console.log('Modelos:', datos.models.map(m => m.model));
    }
    
    // Mostrar comparación
    const comparacion = weatherApp.compararModelosMeteorologicos('Torres del Paine - Glaciar Grey');
    if (comparacion) {
        console.log('Comparación:', comparacion);
    }
    
    // Recargar vista
    showDetail('Torres del Paine - Glaciar Grey');
});
```

3. En la vista de detalle deberías ver la sección de comparación de modelos

---

## 🔍 Verificar en la Consola

Abre la consola del navegador (F12) y verifica:

```javascript
// Verificar que los datos horarios están disponibles
const datos = weatherApp.obtenerDatosClima('Torres del Paine - Glaciar Grey');
console.log('¿Hay datos horarios?', !!datos.hourly);
console.log('Horas disponibles:', datos.hourly ? datos.hourly.time.length : 0);

// Verificar datos históricos
console.log('Días totales (histórico + pronóstico):', datos.daily ? datos.daily.time.length : 0);

// Obtener datos horarios filtrados (próximas 24h)
const ahora = new Date();
const mañana = new Date(ahora);
mañana.setHours(ahora.getHours() + 24);
const datos24h = weatherApp.obtenerDatosHorarios('Torres del Paine - Glaciar Grey', ahora, mañana);
console.log('Datos próximas 24 horas:', datos24h.length);

// Verificar modelos (si están habilitados)
if (datos.models) {
    console.log('Modelos cargados:', datos.models.length);
    console.log('Nombres:', datos.models.map(m => m.model));
}
```

---

## 📝 Notas Importantes

### Datos Horarios
- ✅ **Ya están activos por defecto** - No necesitas hacer nada
- Incluye 11 variables meteorológicas
- Se muestran automáticamente en la vista de detalle

### Datos Históricos
- ✅ **Ya están activos por defecto** - 5 días de historia
- Se muestran automáticamente si hay más de 7 días de datos
- Permite ver tendencias pasadas

### Modelos Múltiples
- ⚠️ **Requieren activación** - No están activos por defecto
- Hacen las peticiones más pesadas (3x más datos)
- Solo activar si realmente necesitas comparar modelos
- Recomendado solo para ciudades principales

---

## 🎨 Visualización de los Gráficos

### Gráfico Horario
- **Altura**: 300px
- **Eje Y izquierdo**: Temperatura (°C) - Naranja
- **Eje Y derecho**: Precipitación (mm) - Azul
- **Eje X**: Horas (formato HH:MM)

### Gráfico Histórico
- **Altura**: 250px
- **Líneas**: Temperatura máxima (roja) y mínima (azul)
- **Eje X**: Fechas (días)
- **Línea vertical punteada**: Marca "hoy" (separa histórico de pronóstico)

---

## 🚀 Ejecución Rápida

1. **Inicia el servidor:**
   ```powershell
   python -m http.server 8000
   ```

2. **Abre el navegador:**
   - http://localhost:8000

3. **Prueba las funcionalidades:**
   - Click en cualquier ciudad → Verás gráfico horario y tendencia histórica
   - Si quieres probar modelos: Usa la consola (ver Prueba 3 arriba)

---

## ✅ Checklist de Verificación

- [ ] Servidor ejecutándose en http://localhost:8000
- [ ] Aplicación carga sin errores
- [ ] Datos de ciudades se cargan correctamente
- [ ] Al hacer click en una ciudad, se muestra el detalle
- [ ] Gráfico horario aparece en la vista de detalle
- [ ] Gráfico histórico aparece en la vista de detalle
- [ ] Tarjetas de tendencia histórica muestran datos
- [ ] (Opcional) Sección de modelos aparece si se activó

---

**¡Disfruta explorando las nuevas funcionalidades! 🎉**
