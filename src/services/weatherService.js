
import { lugares as staticLugares } from '@/data/lugares.js';

const CACHE_KEY = 'weather_data_cache';
const LAST_UPDATE_KEY = 'weather_last_update';

// Mapeo de códigos WMO de Open-Meteo a nuestros estados y descripciones
const wmoCodes = {
    0: { label: 'Soleado', icon: 'Sun' },
    1: { label: 'Soleado', icon: 'Sun' },
    2: { label: 'Parcialmente Nublado', icon: 'CloudSun' },
    3: { label: 'Nublado', icon: 'Cloud' },
    45: { label: 'Niebla', icon: 'CloudFog' },
    48: { label: 'Niebla', icon: 'CloudFog' },
    51: { label: 'Llovizna', icon: 'CloudDrizzle' },
    53: { label: 'Llovizna', icon: 'CloudDrizzle' },
    55: { label: 'Llovizna', icon: 'CloudDrizzle' },
    56: { label: 'Llovizna Gélida', icon: 'CloudDrizzle' },
    57: { label: 'Llovizna Gélida', icon: 'CloudDrizzle' },
    61: { label: 'Lluvioso', icon: 'CloudRain' },
    63: { label: 'Lluvioso', icon: 'CloudRain' },
    65: { label: 'Lluvioso', icon: 'CloudRain' },
    66: { label: 'Lluvia Gélida', icon: 'CloudRain' },
    67: { label: 'Lluvia Gélida', icon: 'CloudRain' },
    71: { label: 'Nieve', icon: 'Snowflake' },
    73: { label: 'Nieve', icon: 'Snowflake' },
    75: { label: 'Nieve', icon: 'Snowflake' },
    77: { label: 'Nevada Ligera', icon: 'Snowflake' },
    80: { label: 'Chubascos', icon: 'CloudRain' },
    81: { label: 'Chubascos Fuertes', icon: 'CloudLightning' },
    82: { label: 'Chubascos Fuertes', icon: 'CloudLightning' },
    85: { label: 'Chubascos de Nieve', icon: 'Snowflake' },
    86: { label: 'Chubascos de Nieve', icon: 'Snowflake' },
    95: { label: 'Tormenta', icon: 'CloudLightning' },
    96: { label: 'Tormenta con Granizo', icon: 'CloudLightning' },
    99: { label: 'Tormenta con Granizo', icon: 'CloudLightning' }
};

export const weatherService = {
    // Comprobar si se debe actualizar (después de las 08:00 o 20:00)
    shouldUpdate() {
        const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
        if (!lastUpdate) return true;

        const lastDate = new Date(parseInt(lastUpdate));
        const now = new Date();

        // Si es un día diferente
        if (lastDate.getDate() !== now.getDate()) return true;

        const currentHour = now.getHours();
        const lastHour = lastDate.getHours();

        // Checkpoints de actualización: 8 AM y 8 PM (20:00)
        // Si pasamos las 8 AM y la última actualización fue antes de las 8 AM
        if (currentHour >= 8 && lastHour < 8) return true;

        // Si pasamos las 8 PM y la última actualización fue antes de las 8 PM
        if (currentHour >= 20 && lastHour < 20) return true;

        return false;
    },

    getLastUpdate() {
        const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
        return lastUpdate ? new Date(parseInt(lastUpdate)) : null;
    },

    async fetchAllWeather(forceUpdate = false) {
        let cachedData = null;
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            cachedData = JSON.parse(cached);
        }

        // Si detectamos datos antiguos con "Desconocido", forzamos la actualización aunque no sea hora
        const needsCleanup = cachedData && JSON.stringify(cachedData).includes('Desconocido');

        // Si no necesitamos actualizar y hay caché válida sin "Desconocido", devolvemos caché
        if (!forceUpdate && !needsCleanup && !this.shouldUpdate()) {
            if (cachedData) return cachedData;
        }

        // Si necesitamos actualizar, llamamos a la API para cada lugar
        try {
            const promises = staticLugares.map(async (lugar) => {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lugar.coordenadas.lat}&longitude=${lugar.coordenadas.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

                const response = await fetch(url);
                const data = await response.json();

                return this.transformData(lugar, data);
            });

            const updatedLugares = await Promise.all(promises);

            // Guardar en caché
            localStorage.setItem(CACHE_KEY, JSON.stringify(updatedLugares));
            localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());

            return updatedLugares;

        } catch (error) {
            console.error('Error fetching weather:', error);
            // Fallback a los datos estáticos o caché si falla la API
            const cached = localStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : staticLugares;
        }
    },

    transformData(lugarBase, apiData) {
        const currentCode = apiData.current.weather_code;
        const weatherInfo = wmoCodes[currentCode] || { label: 'Nublado', icon: 'Cloud' };

        // Transformar pronóstico diario
        const pronosticoSemanal = apiData.daily.time.map((time, index) => {
            const code = apiData.daily.weather_code[index];
            const info = wmoCodes[code] || { label: 'Nublado', icon: 'Cloud' };
            const date = new Date(time + 'T12:00:00'); // Fix timezone offset issue
            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

            return {
                dia: days[date.getDay()],
                min: Math.round(apiData.daily.temperature_2m_min[index]),
                max: Math.round(apiData.daily.temperature_2m_max[index]),
                estado: info.label,
                precipitacion: apiData.daily.precipitation_probability_max[index],
                viento: Math.round(apiData.daily.wind_speed_10m_max[index])
            };
        });

        return {
            ...lugarBase,
            tempActual: Math.round(apiData.current.temperature_2m),
            estadoActual: weatherInfo.label,
            // Mantenemos el icono base del lugar (montaña, etc) o lo cambiamos por el del clima?
            // El usuario pidió "icono dinámico" en WeatherIcon.vue, así que podemos usar el estado.
            // Pero lugar.icono en data/lugares.js era "Mountain", "Snowflake" (tipo de lugar).
            // WeatherIcon.vue usa this.icon.
            // Si cambiamos lugar.icono aquí, cambiamos el icono grande del detalle.
            // En el diseño actual, el icono grande del detalle es fijo del lugar (Mountain) y 
            // hay OTRO icono de clima (WeatherIcon con estado).
            // Mantengamos lugar.icono original para la identidad del lugar, 
            // y usaremos estadoActual para el icono del clima.

            pronosticoSemanal
        };
    }
};
