# 📚 Ejemplos de Uso - Funcionalidades Avanzadas

Este documento muestra cómo usar las nuevas funcionalidades implementadas: **datos horarios**, **múltiples modelos** y **datos históricos**.

---

## 🌟 1. Datos Horarios (Hourly)

### Uso Básico

Por defecto, los datos horarios ya están habilitados cuando cargas datos de clima:

```javascript
// Los datos horarios se cargan automáticamente
await weatherApp.cargarDatosClima();

// Acceder a datos horarios de una ciudad
const torresData = weatherApp.obtenerDatosClima('Torres del Paine - Glaciar Grey');

if (torresData.hourly) {
    console.log('Datos horarios disponibles:', torresData.hourly);
    // torresData.hourly contiene:
    // - time: Array de fechas/horas
    // - temperature_2m: Temperaturas cada hora
    // - precipitation: Precipitación cada hora
    // - wind_speed_10m: Velocidad del viento cada hora
    // - weather_code: Código meteorológico cada hora
    // - precipitation_probability: Probabilidad de lluvia
    // - snowfall: Nieve
    // - pressure_msl: Presión atmosférica
    // - wind_gusts_10m: Ráfagas de viento
    // - cloud_cover_low/mid/high: Cobertura de nubes
}
```

### Obtener Datos Horarios Filtrados

```javascript
// Obtener datos horarios para un rango específico
const hoy = new Date();
const mañana = new Date();
mañana.setDate(mañana.getDate() + 1);

const datosHorarios = weatherApp.obtenerDatosHorarios(
    'Torres del Paine - Glaciar Grey',
    hoy,
    mañana
);

// datosHorarios es un array de objetos:
// [
//   { time: Date, temperature_2m: 15.3, precipitation: 0, ... },
//   { time: Date, temperature_2m: 14.8, precipitation: 0.5, ... },
//   ...
// ]
```

### Deshabilitar Datos Horarios

Si no necesitas datos horarios (para ahorrar ancho de banda):

```javascript
await weatherApp.cargarDatosClima({
    includeHourly: false
});
```

---

## 🔬 2. Múltiples Modelos Meteorológicos

### Habilitar Comparación de Modelos

```javascript
// Cargar datos con múltiples modelos meteorológicos
await weatherApp.cargarDatosClima({
    includeModels: true  // Activa ecmwf_ifs025, gfs_graphcast025, icon_global
});

// O para un lugar específico
const datosConModelos = await weatherApp.cargarDetalleLugar(
    'Torres del Paine - Glaciar Grey',
    { includeModels: true }
);

if (datosConModelos.models) {
    console.log(`${datosConModelos.models.length} modelos disponibles`);
    // datosConModelos.models es un array con:
    // - ecmwf_ifs025 (modelo europeo)
    // - gfs_graphcast025 (modelo estadounidense)
    // - icon_global (modelo alemán)
}
```

### Comparar Modelos

```javascript
// Comparar predicciones de diferentes modelos
const comparacion = weatherApp.compararModelosMeteorologicos(
    'Torres del Paine - Glaciar Grey'
);

if (comparacion) {
    console.log(`Comparando ${comparacion.modelos} modelos`);
    
    // Ver promedios por modelo
    Object.keys(comparacion.promedios).forEach(modelo => {
        const promedios = comparacion.promedios[modelo];
        console.log(`${modelo}:`);
        console.log(`  Temperatura: ${promedios.temperatura}°C`);
        console.log(`  Humedad: ${promedios.humedad}%`);
        console.log(`  Viento: ${promedios.viento} km/h`);
    });
    
    // Ver diferencias significativas (> 2°C)
    if (comparacion.diferencias.length > 0) {
        console.log('Diferencias significativas encontradas:');
        comparacion.diferencias.forEach(diff => {
            console.log(
                `${diff.modelo1} vs ${diff.modelo2}: ` +
                `${diff.diferenciaTemperatura}°C de diferencia`
            );
        });
    }
}
```

### Usar un Modelo Específico

```javascript
const datosConModelos = await weatherApp.cargarDetalleLugar(
    'El Calafate',
    { includeModels: true }
);

if (datosConModelos.models) {
    // Obtener datos del modelo europeo
    const modeloEuropeo = datosConModelos.models.find(m => m.model === 'ecmwf_ifs025');
    
    if (modeloEuropeo) {
        console.log('Temperatura según modelo europeo:', modeloEuropeo.current.temperature_2m);
        console.log('Pronóstico diario:', modeloEuropeo.daily);
    }
}
```

---

## 📅 3. Datos Históricos (Past Days)

### Cargar Datos Históricos

```javascript
// Cargar datos con 5 días de historia (por defecto)
await weatherApp.cargarDatosClima({
    pastDays: 5
});

// O especificar más días históricos
await weatherApp.cargarDatosClima({
    pastDays: 7  // Últimos 7 días
});

// Los datos históricos se incluyen en los arrays daily y hourly
const datos = weatherApp.obtenerDatosClima('Puerto Natales');

if (datos.daily) {
    // El array time incluye días pasados + pronóstico
    console.log('Primera fecha:', datos.daily.time[0]);  // 5 días atrás
    console.log('Última fecha:', datos.daily.time[datos.daily.time.length - 1]);  // +7 días adelante
}
```

### Analizar Tendencia Histórica

```javascript
const datos = weatherApp.obtenerDatosClima('Torres del Paine - Glaciar Grey');

if (datos.daily && datos.daily.time) {
    // Dividir en histórico y pronóstico
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const indiceHoy = datos.daily.time.findIndex(fecha => {
        const date = new Date(fecha);
        date.setHours(0, 0, 0, 0);
        return date >= hoy;
    });
    
    if (indiceHoy > 0) {
        const historico = {
            time: datos.daily.time.slice(0, indiceHoy),
            tempMax: datos.daily.temperature_2m_max.slice(0, indiceHoy),
            tempMin: datos.daily.temperature_2m_min.slice(0, indiceHoy)
        };
        
        const pronostico = {
            time: datos.daily.time.slice(indiceHoy),
            tempMax: datos.daily.temperature_2m_max.slice(indiceHoy),
            tempMin: datos.daily.temperature_2m_min.slice(indiceHoy)
        };
        
        console.log(`Días históricos: ${historico.time.length}`);
        console.log(`Días de pronóstico: ${pronostico.time.length}`);
    }
}
```

---

## 🎨 4. Ejemplo Completo: Gráfico con Datos Horarios

```javascript
// Cargar datos con hourly habilitado
await weatherApp.cargarDatosClima({ includeHourly: true });

const datos = weatherApp.obtenerDatosClima('Torres del Paine - Glaciar Grey');

if (datos.hourly) {
    // Preparar datos para Chart.js (próximas 24 horas)
    const ahora = new Date();
    const mañana = new Date(ahora);
    mañana.setHours(ahora.getHours() + 24);
    
    const datos24h = weatherApp.obtenerDatosHorarios(
        'Torres del Paine - Glaciar Grey',
        ahora,
        mañana
    );
    
    // Extraer arrays para el gráfico
    const labels = datos24h.map(d => 
        d.time.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    );
    const temperaturas = datos24h.map(d => d.temperature_2m);
    const precipitacion = datos24h.map(d => d.precipitation);
    
    // Crear gráfico con Chart.js
    const ctx = document.getElementById('hourlyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperatura (°C)',
                    data: temperaturas,
                    borderColor: '#ff9800',
                    yAxisID: 'y'
                },
                {
                    label: 'Precipitación (mm)',
                    data: precipitacion,
                    borderColor: '#2196f3',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { type: 'linear', position: 'left' },
                y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false } }
            }
        }
    });
}
```

---

## 🔄 5. Combinar Todas las Funcionalidades

```javascript
// Cargar datos completos: hourly + models + historical
await weatherApp.cargarDatosClima({
    includeHourly: true,
    includeModels: true,
    pastDays: 7
});

const datos = await weatherApp.cargarDetalleLugar(
    'Torres del Paine - Glaciar Grey',
    {
        includeHourly: true,
        includeModels: true,
        pastDays: 7
    }
);

// Usar datos horarios
const proximas24h = weatherApp.obtenerDatosHorarios(
    'Torres del Paine - Glaciar Grey',
    new Date(),
    new Date(Date.now() + 24 * 60 * 60 * 1000)
);

// Comparar modelos
const comparacion = weatherApp.compararModelosMeteorologicos(
    'Torres del Paine - Glaciar Grey'
);

// Analizar datos históricos
if (datos.daily && datos.daily.time.length > 7) {
    const tempPromedioHistorico = datos.daily.temperature_2m_max
        .slice(0, 7)
        .reduce((sum, temp) => sum + temp, 0) / 7;
    
    console.log('Temperatura promedio últimos 7 días:', tempPromedioHistorico);
}
```

---

## ⚙️ 6. Configuración por Ciudad

Puedes cargar diferentes niveles de detalle para diferentes ciudades:

```javascript
// Para ciudades principales: datos completos
const principales = ['Torres del Paine - Glaciar Grey', 'Puerto Natales'];
for (const ciudad of principales) {
    const lugar = weatherApp.lugares.find(l => l.nombre === ciudad);
    if (lugar) {
        await weatherApp.apiClient.obtenerDatosClima(
            ciudad,
            lugar.coords,
            { includeHourly: true, includeModels: true, pastDays: 7 }
        );
    }
}

// Para otras ciudades: solo datos básicos
const otras = weatherApp.obtenerTodosLosLugares()
    .filter(c => !principales.includes(c));
for (const ciudad of otras) {
    const lugar = weatherApp.lugares.find(l => l.nombre === ciudad);
    if (lugar) {
        await weatherApp.apiClient.obtenerDatosClima(
            ciudad,
            lugar.coords,
            { includeHourly: false, includeModels: false, pastDays: 0 }
        );
    }
}
```

---

## 📊 Variables Disponibles en Datos Horarios

Cuando `includeHourly: true`, tienes acceso a:

- `temperature_2m` - Temperatura a 2m de altura
- `precipitation_probability` - Probabilidad de precipitación (%)
- `snowfall` - Nieve (cm)
- `pressure_msl` - Presión a nivel del mar (hPa)
- `wind_speed_10m` - Velocidad del viento a 10m (km/h)
- `wind_gusts_10m` - Ráfagas de viento a 10m (km/h)
- `precipitation` - Precipitación (mm)
- `cloud_cover_low` - Cobertura de nubes bajas (%)
- `cloud_cover_mid` - Cobertura de nubes medias (%)
- `cloud_cover_high` - Cobertura de nubes altas (%)
- `weather_code` - Código meteorológico WMO

---

**¡Disfruta explorando estas funcionalidades avanzadas! 🚀**
