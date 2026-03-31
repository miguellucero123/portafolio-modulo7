/**
 * Configuración de ciudades y coordenadas para la aplicación meteorológica
 * Define los lugares que la app mostrará con sus coordenadas geográficas
 */

const CIUDADES_CONFIG = [
    {
        nombre: "Torres del Paine - Glaciar Grey",
        coords: {
            lat: -51.0,
            lon: -73.23,
            distance: 0,
            zone: "Glaciar Grey"
        }
    },
    {
        nombre: "Puerto Natales",
        coords: {
            lat: -51.7252,
            lon: -72.5149,
            distance: 105,
            zone: "Zona Sur - Chile"
        }
    },
    {
        nombre: "El Calafate",
        coords: {
            lat: -50.3399,
            lon: -72.255,
            distance: 290,
            zone: "Zona Este - Argentina"
        }
    },
    {
        nombre: "Glaciar Perito Moreno",
        coords: {
            lat: -50.47,
            lon: -73.03,
            distance: 350,
            zone: "Zona Glaciar Arg"
        }
    },
    {
        nombre: "El Chaltén",
        coords: {
            lat: -49.3318,
            lon: -73.1641,
            distance: 490,
            zone: "Zona Sierras"
        }
    },
    {
        nombre: "Punta Arenas",
        coords: {
            lat: -53.1638,
            lon: -70.9181,
            distance: 350,
            zone: "Zona Austral"
        }
    },
    {
        nombre: "Río Gallegos",
        coords: {
            lat: -51.6298,
            lon: -69.2181,
            distance: 580,
            zone: "Zona Atlántica"
        }
    },
    {
        nombre: "Villa O'Higgins",
        coords: {
            lat: -48.4667,
            lon: -72.5667,
            distance: 285,
            zone: "Zona Norte"
        }
    },
    {
        nombre: "Gobernador Gregores",
        coords: {
            lat: -49.8,
            lon: -70.25,
            distance: 520,
            zone: "Zona Estepa"
        }
    },
    {
        nombre: "Tres Lagos",
        coords: {
            lat: -50.2833,
            lon: -72.7,
            distance: 400,
            zone: "Zona Centro"
        }
    }
];

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CIUDADES_CONFIG = CIUDADES_CONFIG;
}
