/**
 * Utilidades y helpers para la aplicación
 * Módulo 6
 */

/**
 * Obtiene el icono del clima según el estado
 */
export function getWeatherIcon(estado) {
  const iconos = {
    'Soleado': 'Sun',
    'Nublado': 'Cloud',
    'Niebla': 'Cloud',
    'Lluvioso': 'CloudRain',
    'Llovizna': 'CloudRain',
    'Llovizna Gélida': 'CloudRain',
    'Lluvia Gélida': 'Snowflake',
    'Chubascos': 'CloudRain',
    'Chubascos Fuertes': 'CloudLightning',
    'Parcialmente Nublado': 'CloudSun',
    'Nieve': 'Snowflake',
    'Nevada Ligera': 'Snowflake',
    'Chubascos de Nieve': 'Snowflake',
    'Tormenta': 'CloudLightning',
    'Tormenta con Granizo': 'CloudLightning'
  };
  return iconos[estado] || 'Cloud';
}

/**
 * Obtiene la clase CSS según el estado del clima para backgrounds y contrastes
 */
export function getWeatherClass(estado) {
  if (!estado) return 'default';

  if (estado.includes('Soleado')) return 'sunny';
  if (estado.includes('Nublado') || estado.includes('Niebla')) return 'cloudy';
  if (estado.includes('Lluvia') || estado.includes('Llovizna') || estado.includes('Chubascos') && !estado.includes('Nieve')) return 'rainy';
  if (estado.includes('Nieve') || estado.includes('Gélida')) return 'snowy';
  if (estado.includes('Tormenta')) return 'storm';

  return 'default';
}

/**
 * Formatea temperatura con símbolo
 */
export function formatTemp(temp, unit = 'C') {
  return `${Math.round(temp)}°${unit}`;
}

/**
 * Convierte Celsius a Fahrenheit
 */
export function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

/**
 * Calcula la Sensación Térmica (Wind Chill)
 * Fórmula válida para T <= 10°C y V >= 4.8 km/h
 * Si no cumple, retorna la temperatura real
 */
export function calculateWindChill(tempC, windKmh) {
  if (tempC <= 10 && windKmh >= 4.8) {
    const windChill = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16);
    return Math.round(windChill);
  }
  return tempC;
}

/**
 * Calcula estadísticas del pronóstico semanal
 */
export function calcularEstadisticas(pronostico) {
  if (!pronostico || pronostico.length === 0) {
    return null;
  }

  const temperaturas = pronostico.flatMap(dia => [dia.min, dia.max]);
  const tempMin = Math.min(...temperaturas);
  const tempMax = Math.max(...temperaturas);
  const tempPromedio = temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length;

  // Contar días por estado
  const diasPorEstado = pronostico.reduce((acc, dia) => {
    acc[dia.estado] = (acc[dia.estado] || 0) + 1;
    return acc;
  }, {});

  const estadoMasFrecuente = Object.entries(diasPorEstado)
    .sort((a, b) => b[1] - a[1])[0][0];

  // Calcular precipitación y viento promedio si están disponibles
  const precipitacionPromedio = pronostico.reduce((acc, dia) =>
    acc + (dia.precipitacion || 0), 0) / pronostico.length;

  const vientoPromedio = pronostico.reduce((acc, dia) =>
    acc + (dia.viento || 0), 0) / pronostico.length;

  return {
    tempMin: Math.round(tempMin * 10) / 10,
    tempMax: Math.round(tempMax * 10) / 10,
    tempPromedio: Math.round(tempPromedio * 10) / 10,
    estadoMasFrecuente,
    diasPorEstado,
    precipitacionPromedio: Math.round(precipitacionPromedio),
    vientoPromedio: Math.round(vientoPromedio)
  };
}

/**
 * Genera un resumen textual del pronóstico
 */
export function generarResumenPronostico(estadisticas) {
  if (!estadisticas) return '';

  const { tempMin, tempMax, estadoMasFrecuente, diasPorEstado } = estadisticas;

  let resumen = `La semana tendrá temperaturas entre ${tempMin}°C y ${tempMax}°C. `;

  if (estadoMasFrecuente === 'Soleado') {
    resumen += 'Se esperan principalmente días soleados, ¡ideal para excursiones!';
  } else if (estadoMasFrecuente === 'Lluvioso') {
    resumen += 'Prepárate para lluvia frecuente. Lleva equipo impermeable.';
  } else {
    resumen += 'Condiciones variables. Prepárate para todo tipo de clima.';
  }

  return resumen;
}

export function generateHourlyForecast(dia) {
  const hours = [
    { time: '06:00', label: 'Mañana' },
    { time: '09:00', label: 'Mañana' },
    { time: '12:00', label: 'Mediodía' },
    { time: '15:00', label: 'Tarde' },
    { time: '18:00', label: 'Tarde' },
    { time: '21:00', label: 'Noche' }
  ];

  // Curva de temperatura simple: sube hasta las 15:00 y luego baja
  return hours.map((h, index) => {
    let temp;
    // Aproximación de curva sinusoidal entre min y max
    if (index <= 3) { // Subiendo
      const ratio = index / 3;
      temp = dia.min + (dia.max - dia.min) * ratio;
    } else { // Bajando
      const ratio = (index - 3) / 2;
      temp = dia.max - (dia.max - dia.min) * ratio * 0.5; // Baja más lento
    }

    return {
      time: h.time,
      temp: Math.round(temp),
      condition: dia.estado, // Simplificación: mismo estado todo el día
      wind: Math.round(dia.viento * (0.8 + Math.random() * 0.4)), // Variación aleatoria +/- 20%
      precip: dia.precipitacion > 0 ? Math.round(dia.precipitacion * (0.5 + Math.random() * 0.5)) : 0
    };
  });
}

/**
 * Filtra lugares por nombre o circuito
 */
export function filtrarLugares(lugares, filtro) {
  if (!filtro) return lugares;

  const filtroLower = filtro.toLowerCase().trim();
  return lugares.filter(lugar =>
    lugar.nombre.toLowerCase().includes(filtroLower) ||
    lugar.circuito.toLowerCase().includes(filtroLower) ||
    lugar.descripcion.toLowerCase().includes(filtroLower)
  );
}

/**
 * Ordena lugares por temperatura
 */
export function ordenarPorTemperatura(lugares, ascendente = true) {
  return [...lugares].sort((a, b) =>
    ascendente
      ? a.tempActual - b.tempActual
      : b.tempActual - a.tempActual
  );
}

/**
 * Obtiene el color según la dificultad
 */
export function getDificultadColor(dificultad) {
  const colores = {
    'Baja': 'success',
    'Baja-Media': 'info',
    'Media': 'warning',
    'Media-Alta': 'orange',
    'Alta': 'danger'
  };
  return colores[dificultad] || 'secondary';
}
