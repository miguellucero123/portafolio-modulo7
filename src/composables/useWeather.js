
import { computed } from 'vue';
import { useStore } from 'vuex';

/**
 * Clima y lugares: estado en Vuex (lista, carga, error, lugar seleccionado / pronóstico vía getters).
 */
export function useWeather() {
  const store = useStore();

  const lugares = computed(() => store.state.weatherLugares);
  const loading = computed(() => store.state.weatherLoading);
  const error = computed(() => store.state.weatherError);
  const lastUpdate = computed(() => store.state.weatherLastUpdate);

  const fetchWeather = async (force = false) => {
    await store.dispatch('fetchWeather', force);
  };

  const getLugarById = (id) =>
    computed(() => store.getters.lugarByWeatherId(id));

  return {
    lugares,
    loading,
    error,
    lastUpdate,
    fetchWeather,
    getLugarById
  };
}
