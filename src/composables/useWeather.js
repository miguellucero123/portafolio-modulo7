
import { ref, computed } from 'vue';
import { lugares as staticLugares } from '@/data/lugares.js';

const lugares = ref(staticLugares);
const loading = ref(false);
const error = ref(null);
const lastUpdate = ref(null);

export function useWeather() {

    const updateLastUpdateDate = async () => {
        const serviceModule = await import('@/services/weatherService.js');
        lastUpdate.value = serviceModule.weatherService.getLastUpdate();
    };

    const fetchWeather = async (force = false) => {
        loading.value = true;
        error.value = null;

        try {
            const serviceModule = await import('@/services/weatherService.js');
            const service = serviceModule.weatherService;

            const data = await service.fetchAllWeather(force);
            if (data && data.length > 0) {
                lugares.value = data;
            }
            lastUpdate.value = service.getLastUpdate();
        } catch (e) {
            console.error("Error updating weather:", e);
            error.value = e;

            // Fallback to cache if exists
            const cached = localStorage.getItem('weather_data_cache');
            if (cached) {
                lugares.value = JSON.parse(cached);
            }
        } finally {
            loading.value = false;
        }
    };

    const getLugarById = (id) => {
        return computed(() => lugares.value.find(l => l.id == id));
    };

    // Initialize lastUpdate value if possible
    updateLastUpdateDate();

    return {
        lugares,
        loading,
        error,
        lastUpdate,
        fetchWeather,
        getLugarById
    };
}
