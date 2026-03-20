<template>
  <div class="home-view">
    <div class="container">
      <!-- Header -->
      <header class="page-header">
        <h1 class="page-title">
          <WeatherIcon icon="CloudSun" :size="48" class="header-icon" /> Pronóstico Meteorológico
          <span class="subtitle">Torres del Paine - Circuitos W y O</span>
        </h1>
        <p class="page-description">
          Conoce las condiciones climáticas actuales de los principales puntos 
          de los circuitos más emblemáticos de la Patagonia chilena
        </p>
        <div class="update-info" v-if="lastUpdate">
          <span class="update-text">
            <RefreshCw :size="14" :class="{ 'spin': loading }" /> 
            Última actualización: {{ formattedLastUpdate }}
          </span>
          <button @click="fetchWeather(true)" class="btn-refresh" :disabled="loading">
            Actualizar ahora
          </button>
        </div>
      </header>

      <!-- Barra de búsqueda y filtros -->
      <section class="filters-section glass-card">
        <div class="search-bar">
          <span class="search-icon"><Search :size="20" /></span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar lugar por nombre, circuito o descripción..."
            class="search-input input-glass"
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="clear-btn"
            title="Limpiar búsqueda"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="filter-buttons">
          <button 
            :class="['filter-btn', { active: circuitoFiltro === 'Todos' }]"
            @click="circuitoFiltro = 'Todos'"
          >
            Todos
          </button>
          <button 
            :class="['filter-btn', { active: circuitoFiltro === 'W' }]"
            @click="circuitoFiltro = 'W'"
          >
            Circuito W
          </button>
          <button 
            :class="['filter-btn', { active: circuitoFiltro === 'O' }]"
            @click="circuitoFiltro = 'O'"
          >
            Circuito O
          </button>
        </div>

        <div class="sort-controls">
          <label class="sort-label">Ordenar por:</label>
          <select v-model="ordenamiento" class="sort-select">
            <option value="nombre">Nombre</option>
            <option value="temp-asc">Temperatura (menor a mayor)</option>
            <option value="temp-desc">Temperatura (mayor a menor)</option>
            <option value="dificultad">Dificultad</option>
          </select>
        </div>
      </section>

      <!-- Estadísticas generales -->
      <section class="stats-section" v-if="lugaresFiltrados.length > 0">
        <div class="stat-card glass-card">
          <div class="stat-icon"><MapPin :size="32" class="text-primary" /></div>
          <div class="stat-value">{{ lugaresFiltrados.length }}</div>
          <div class="stat-label">Lugares</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon"><Thermometer :size="32" class="text-warning" /></div>
          <div class="stat-value">{{ temperaturaPromedio }}°{{ tempUnit }}</div>
          <div class="stat-label">Temp. Promedio</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon">
            <WeatherIcon :icon="estadoClimaPredominante.icono" :size="32" />
          </div>
          <div class="stat-value">{{ estadoClimaPredominante.nombre }}</div>
          <div class="stat-label">Estado Predominante</div>
        </div>
      </section>

      <!-- Mensaje cuando no hay resultados -->
      <div v-if="lugaresFiltrados.length === 0" class="no-results glass-card">
        <div class="no-results-icon"><Frown :size="64" /></div>
        <h3>No se encontraron lugares</h3>
        <p>Intenta con otro término de búsqueda o filtro</p>
        <button @click="resetFilters" class="reset-btn btn-primary">
          Restablecer filtros
        </button>
      </div>

      <!-- Grid de tarjetas de lugares -->
      <section v-else class="places-grid" :class="{ 'loading-opacity': loading }">
        <PlaceCard
          v-for="lugar in lugaresFiltrados"
          :key="lugar.id"
          :lugar="lugar"
          :temp-unit="tempUnit"
          :show-favorite="true"
        />
      </section>

      <!-- Loading Overlay -->
      <div v-if="loading && lugares.length === 0" class="loading-full glass-card">
        <div class="spinner"></div>
        <p>Cargando datos climáticos...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useWeather } from '@composables/useWeather.js';
import PlaceCard from '@components/PlaceCard.vue';
import WeatherIcon from '@components/WeatherIcon.vue';
import { Search, X, MapPin, Thermometer, Frown, RefreshCw } from 'lucide-vue-next';
import { 
  filtrarLugares, 
  ordenarPorTemperatura, 
  celsiusToFahrenheit,
  getWeatherIcon 
} from '@utils/helpers.js';

export default {
  name: 'Home',
  components: {
    PlaceCard,
    WeatherIcon,
    Search,
    X,
    MapPin,
    Thermometer,
    Frown,
    RefreshCw
  },
  props: {
    tempUnit: {
      type: String,
      default: 'C'
    }
  },
  setup() {
    const { lugares, fetchWeather, loading, error, lastUpdate } = useWeather();
    return { lugares, fetchWeather, loading, error, lastUpdate };
  },
  data() {
    return {
      searchQuery: '',
      circuitoFiltro: 'Todos',
      ordenamiento: 'nombre'
    };
  },
  mounted() {
    this.fetchWeather();
  },
  computed: {
    lugaresFiltrados() {
      let resultado = [...this.lugares];

      // Filtrar por búsqueda
      if (this.searchQuery.trim()) {
        resultado = filtrarLugares(resultado, this.searchQuery);
      }

      // Filtrar por circuito
      if (this.circuitoFiltro !== 'Todos') {
        resultado = resultado.filter(lugar => lugar.circuito === this.circuitoFiltro);
      }

      // Ordenar
      switch (this.ordenamiento) {
        case 'nombre':
          resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
          break;
        case 'temp-asc':
          resultado = ordenarPorTemperatura(resultado, true);
          break;
        case 'temp-desc':
          resultado = ordenarPorTemperatura(resultado, false);
          break;
        case 'dificultad':
          const dificultadOrden = { 'Baja': 1, 'Baja-Media': 2, 'Media': 3, 'Media-Alta': 4, 'Alta': 5 };
          resultado.sort((a, b) => dificultadOrden[a.dificultad] - dificultadOrden[b.dificultad]);
          break;
      }

      return resultado;
    },
    temperaturaPromedio() {
      if (this.lugaresFiltrados.length === 0) return 0;
      const sum = this.lugaresFiltrados.reduce((acc, lugar) => acc + lugar.tempActual, 0);
      const promedio = sum / this.lugaresFiltrados.length;
      
      if (this.tempUnit === 'F') {
        return Math.round(celsiusToFahrenheit(promedio));
      }
      return Math.round(promedio);
    },
    estadoClimaPredominante() {
      if (this.lugaresFiltrados.length === 0) {
        return { nombre: '-', icono: '🌤️' };
      }

      const conteo = this.lugaresFiltrados.reduce((acc, lugar) => {
        acc[lugar.estadoActual] = (acc[lugar.estadoActual] || 0) + 1;
        return acc;
      }, {});

      const estadoMax = Object.entries(conteo)
        .sort((a, b) => b[1] - a[1])[0][0];

      return {
        nombre: estadoMax,
        icono: getWeatherIcon(estadoMax)
      };
    },
    formattedLastUpdate() {
      if (!this.lastUpdate) return '';
      return new Intl.DateTimeFormat('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      }).format(this.lastUpdate);
    }
  },
  methods: {
    resetFilters() {
      this.searchQuery = '';
      this.circuitoFiltro = 'Todos';
      this.ordenamiento = 'nombre';
    }
  }
};
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  display: block;
  font-size: 1.25rem;
  font-weight: 400;
  margin-top: 0.5rem;
  opacity: 0.9;
}

.page-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  max-width: 700px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}

.update-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.update-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-refresh {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease;
}

.search-bar {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 3.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #e0e0e0;
  transform: translateY(-50%) scale(1.1);
}

.filter-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-label {
  font-weight: 600;
  color: #333;
}

.sort-select {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* No Results */
.no-results {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-results h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #666;
  margin-bottom: 1.5rem;
}

.reset-btn {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Places Grid */
.places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  animation: fadeIn 1s ease;
  transition: opacity 0.3s;
}

.loading-opacity {
  opacity: 0.5;
  pointer-events: none;
}

.loading-full {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  margin-top: 2rem;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .filters-section {
    padding: 1rem;
  }

  .sort-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .places-grid {
    grid-template-columns: 1fr;
  }
}
</style>
