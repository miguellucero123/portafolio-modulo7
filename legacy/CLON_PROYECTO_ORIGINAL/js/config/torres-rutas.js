/**
 * Configuración de rutas y sectores de Torres del Paine
 * Circuitos W y O con coordenadas aproximadas
 */

// Coordenadas de los sectores principales
export const SECTORES = {
    // Circuito W
    "Sector Grey": {
        lat: -51.0,
        lon: -73.23,
        circuito: "W",
        icon: "fa-snowflake",
        servicios: ["bed", "tent", "wifi", "shower"],
        descripcion: "Refugio Glaciar Grey - Zona occidental"
    },
    "Sector Paine Grande": {
        lat: -50.9500,
        lon: -73.1167,
        circuito: "W",
        icon: "fa-house",
        servicios: ["bed", "tent", "wifi", "shower"],
        descripcion: "Refugio principal - Lago Pehoé"
    },
    "Sector Francés": {
        lat: -50.9667,
        lon: -73.0833,
        circuito: "W",
        icon: "fa-tree",
        servicios: ["bed", "tent", "wifi", "shower"],
        descripcion: "Mirador Valle del Francés - Centro del circuito"
    },
    "Sector Cuernos": {
        lat: -50.9333,
        lon: -73.0167,
        circuito: "W",
        icon: "fa-mountain",
        servicios: ["bed", "tent", "wifi", "shower"],
        descripcion: "Vista panorámica de Los Cuernos"
    },
    "Sector Chileno": {
        lat: -50.9417,
        lon: -72.9667,
        circuito: "W",
        icon: "fa-campground",
        servicios: ["bed", "tent", "wifi", "shower"],
        descripcion: "Campamento Chileno - Acceso a Base Torres"
    },
    "Sector Central": {
        lat: -50.9417,
        lon: -72.95,
        circuito: "W",
        icon: "fa-building",
        servicios: ["bed", "tent", "wifi", "shower"],
        descripcion: "Sector Central - Hotel Las Torres"
    },
    // Circuito O
    "Sector Serón": {
        lat: -50.88,
        lon: -72.92,
        circuito: "O",
        icon: "fa-campground",
        servicios: ["bed", "tent", "wifi", "shower"],
        descripcion: "Sector Serón - Inicio Circuito O"
    },
    "Sector Dickson": {
        lat: -50.85,
        lon: -73.05,
        circuito: "O",
        icon: "fa-campground",
        servicios: ["bed", "tent"],
        descripcion: "Sector Dickson - Zona norte"
    },
    "Sector Perros": {
        lat: -50.82,
        lon: -73.12,
        circuito: "O",
        icon: "fa-campground",
        servicios: ["tent"],
        descripcion: "Sector Perros - Campamento"
    }
};

// Puntos de interés especiales
export const PUNTOS_INTERES = {
    "Hotel Las Torres": {
        lat: -50.9417,
        lon: -72.95,
        icon: "fa-hotel",
        servicios: ["bed", "food", "wifi", "person", "shower"],
        descripcion: "Hotel Las Torres Patagonia",
        destacado: true
    },
    "Centro de Bienvenida": {
        lat: -50.94,
        lon: -72.94,
        icon: "fa-info-circle",
        servicios: ["bus", "wifi", "shower"],
        descripcion: "Centro de Bienvenida del Parque"
    },
    "Las Torres": {
        lat: -50.95,
        lon: -72.98,
        icon: "fa-mountain",
        descripcion: "Las Torres - Punto más emblemático",
        destacado: true,
        esVista: true
    }
};

// Rutas del Circuito W (forma de W)
export const RUTA_CIRCUITO_W = [
    [-51.0, -73.23],      // Sector Grey
    [-50.9500, -73.1167], // Sector Paine Grande
    [-50.9583, -73.0667], // Campamento Italiano
    [-50.9667, -73.0833], // Sector Francés
    [-50.9333, -73.0167], // Sector Cuernos
    [-50.9417, -72.9667], // Sector Chileno / Base Torres
    [-50.9417, -72.95]    // Sector Central / Hotel Las Torres
];

// Rutas del Circuito O (circuito completo)
export const RUTA_CIRCUITO_O = [
    [-50.9417, -72.95],   // Hotel Las Torres / Sector Central
    [-50.88, -72.92],     // Sector Serón
    [-50.85, -73.05],     // Sector Dickson
    [-50.82, -73.12],     // Sector Perros
    [-51.0, -73.23],      // Sector Grey (conexión con W)
    [-50.9500, -73.1167], // Sector Paine Grande
    [-50.9583, -73.0667], // Campamento Italiano
    [-50.9667, -73.0833], // Sector Francés
    [-50.9333, -73.0167], // Sector Cuernos
    [-50.9417, -72.9667], // Sector Chileno
    [-50.9417, -72.95]    // Regreso a Hotel Las Torres
];

// Ruta azul (conexión Hotel Las Torres - Sector Chileno - Sector Central)
export const RUTA_AZUL = [
    [-50.9417, -72.95],   // Hotel Las Torres
    [-50.9417, -72.9667], // Sector Chileno
    [-50.9417, -72.95]     // Sector Central
];

// Puntos de vista fotográficos (cámaras verdes)
export const PUNTOS_VISTA = [
    { lat: -50.945, lon: -72.98, nombre: "Vista Las Torres" },
    { lat: -50.96, lon: -73.08, nombre: "Mirador Valle Francés" },
    { lat: -50.93, lon: -73.02, nombre: "Vista Los Cuernos" },
    { lat: -50.95, lon: -73.11, nombre: "Vista Lago Pehoé" },
    { lat: -51.0, lon: -73.23, nombre: "Vista Glaciar Grey" }
];
