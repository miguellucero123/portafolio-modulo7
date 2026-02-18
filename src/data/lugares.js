/**
 * Datos de lugares de Torres del Paine
 * Circuitos W y O - Módulo 6
 */

export const lugares = [
  {
    id: 1,
    nombre: "Base Torres",
    tempActual: 8,
    estadoActual: "Nublado",
    circuito: "W",
    descripcion: "Mirador Base Torres - Punto más emblemático del circuito",
    altitud: 900,
    dificultad: "Alta",
    icono: "Mountain",
    coordenadas: { lat: -50.9417, lon: -72.9667 },
    pronosticoSemanal: [
      { dia: "Lunes", min: 5, max: 12, estado: "Nublado", precipitacion: 40, viento: 25 },
      { dia: "Martes", min: 4, max: 10, estado: "Lluvioso", precipitacion: 80, viento: 30 },
      { dia: "Miércoles", min: 3, max: 9, estado: "Lluvioso", precipitacion: 75, viento: 28 },
      { dia: "Jueves", min: 6, max: 13, estado: "Soleado", precipitacion: 10, viento: 15 },
      { dia: "Viernes", min: 7, max: 14, estado: "Soleado", precipitacion: 5, viento: 12 },
      { dia: "Sábado", min: 5, max: 11, estado: "Nublado", precipitacion: 30, viento: 20 },
      { dia: "Domingo", min: 4, max: 10, estado: "Lluvioso", precipitacion: 70, viento: 27 }
    ]
  },
  {
    id: 2,
    nombre: "Glaciar Grey",
    tempActual: 6,
    estadoActual: "Nublado",
    circuito: "W",
    descripcion: "Refugio Glaciar Grey - Zona occidental con vista al glaciar",
    altitud: 50,
    dificultad: "Media",
    icono: "Snowflake",
    coordenadas: { lat: -51.0, lon: -73.23 },
    pronosticoSemanal: [
      { dia: "Lunes", min: 3, max: 9, estado: "Nublado", precipitacion: 45, viento: 30 },
      { dia: "Martes", min: 2, max: 8, estado: "Lluvioso", precipitacion: 85, viento: 35 },
      { dia: "Miércoles", min: 1, max: 7, estado: "Lluvioso", precipitacion: 80, viento: 33 },
      { dia: "Jueves", min: 4, max: 10, estado: "Soleado", precipitacion: 15, viento: 18 },
      { dia: "Viernes", min: 5, max: 11, estado: "Soleado", precipitacion: 10, viento: 15 },
      { dia: "Sábado", min: 3, max: 9, estado: "Nublado", precipitacion: 35, viento: 25 },
      { dia: "Domingo", min: 2, max: 8, estado: "Lluvioso", precipitacion: 75, viento: 32 }
    ]
  },
  {
    id: 3,
    nombre: "Valle del Francés",
    tempActual: 9,
    estadoActual: "Soleado",
    circuito: "W",
    descripcion: "Mirador Valle del Francés - Centro del circuito con vistas espectaculares",
    altitud: 300,
    dificultad: "Media-Alta",
    icono: "Trees",
    coordenadas: { lat: -50.9667, lon: -73.0833 },
    pronosticoSemanal: [
      { dia: "Lunes", min: 6, max: 13, estado: "Soleado", precipitacion: 20, viento: 20 },
      { dia: "Martes", min: 5, max: 11, estado: "Nublado", precipitacion: 40, viento: 25 },
      { dia: "Miércoles", min: 4, max: 10, estado: "Lluvioso", precipitacion: 65, viento: 28 },
      { dia: "Jueves", min: 7, max: 14, estado: "Soleado", precipitacion: 10, viento: 15 },
      { dia: "Viernes", min: 8, max: 15, estado: "Soleado", precipitacion: 5, viento: 12 },
      { dia: "Sábado", min: 6, max: 12, estado: "Nublado", precipitacion: 30, viento: 22 },
      { dia: "Domingo", min: 5, max: 11, estado: "Nublado", precipitacion: 35, viento: 24 }
    ]
  },
  {
    id: 4,
    nombre: "Refugio Paine Grande",
    tempActual: 10,
    estadoActual: "Soleado",
    circuito: "O",
    descripcion: "Refugio principal - Lago Pehoé, punto de partida de múltiples rutas",
    altitud: 50,
    dificultad: "Baja",
    icono: "Home",
    coordenadas: { lat: -50.9500, lon: -73.1167 },
    pronosticoSemanal: [
      { dia: "Lunes", min: 7, max: 14, estado: "Soleado", precipitacion: 15, viento: 18 },
      { dia: "Martes", min: 6, max: 12, estado: "Nublado", precipitacion: 35, viento: 23 },
      { dia: "Miércoles", min: 5, max: 11, estado: "Lluvioso", precipitacion: 60, viento: 26 },
      { dia: "Jueves", min: 8, max: 15, estado: "Soleado", precipitacion: 10, viento: 15 },
      { dia: "Viernes", min: 9, max: 16, estado: "Soleado", precipitacion: 5, viento: 12 },
      { dia: "Sábado", min: 7, max: 13, estado: "Nublado", precipitacion: 25, viento: 20 },
      { dia: "Domingo", min: 6, max: 12, estado: "Nublado", precipitacion: 30, viento: 22 }
    ]
  },
  {
    id: 5,
    nombre: "Campamento Italiano",
    tempActual: 7,
    estadoActual: "Nublado",
    circuito: "W",
    descripcion: "Campamento Italiano - Acceso al Valle del Francés",
    altitud: 120,
    dificultad: "Media",
    icono: "Tent",
    coordenadas: { lat: -50.9583, lon: -73.0667 },
    pronosticoSemanal: [
      { dia: "Lunes", min: 4, max: 11, estado: "Nublado", precipitacion: 45, viento: 22 },
      { dia: "Martes", min: 3, max: 9, estado: "Lluvioso", precipitacion: 75, viento: 28 },
      { dia: "Miércoles", min: 2, max: 8, estado: "Lluvioso", precipitacion: 70, viento: 26 },
      { dia: "Jueves", min: 5, max: 12, estado: "Soleado", precipitacion: 15, viento: 16 },
      { dia: "Viernes", min: 6, max: 13, estado: "Soleado", precipitacion: 10, viento: 14 },
      { dia: "Sábado", min: 4, max: 10, estado: "Nublado", precipitacion: 40, viento: 23 },
      { dia: "Domingo", min: 3, max: 9, estado: "Lluvioso", precipitacion: 68, viento: 25 }
    ]
  },
  {
    id: 6,
    nombre: "Los Cuernos",
    tempActual: 11,
    estadoActual: "Soleado",
    circuito: "O",
    descripcion: "Vista panorámica de Los Cuernos - Formaciones rocosas icónicas",
    altitud: 200,
    dificultad: "Baja-Media",
    icono: "MountainSnow",
    coordenadas: { lat: -50.9750, lon: -73.0500 },
    pronosticoSemanal: [
      { dia: "Lunes", min: 8, max: 15, estado: "Soleado", precipitacion: 10, viento: 17 },
      { dia: "Martes", min: 7, max: 13, estado: "Nublado", precipitacion: 30, viento: 22 },
      { dia: "Miércoles", min: 6, max: 12, estado: "Lluvioso", precipitacion: 55, viento: 24 },
      { dia: "Jueves", min: 9, max: 16, estado: "Soleado", precipitacion: 8, viento: 14 },
      { dia: "Viernes", min: 10, max: 17, estado: "Soleado", precipitacion: 5, viento: 11 },
      { dia: "Sábado", min: 8, max: 14, estado: "Nublado", precipitacion: 20, viento: 19 },
      { dia: "Domingo", min: 7, max: 13, estado: "Nublado", precipitacion: 28, viento: 21 }
    ]
  }
];
