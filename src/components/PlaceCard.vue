<template>
  <router-link :to="`/lugar/${lugar.id}`" class="place-card">
    <div class="card-header" :class="getWeatherClass(lugar.estadoActual)">
      <div class="place-icon">
        <WeatherIcon :icon="lugar.icono" :size="48" :stroke-width="1.5" />
      </div>
      <div class="weather-badge">
        <span class="weather-icon" :class="getWeatherIconColorClass(lugar.estadoActual)">
          <WeatherIcon :icon="getWeatherIcon(lugar.estadoActual)" :size="18" class="weather-icon-shadow" />
        </span>
        <span class="weather-text">{{ lugar.estadoActual }}</span>
      </div>
    </div>

    <div class="card-body">
      <h3 class="place-name">{{ lugar.nombre }}</h3>
      
      <p class="place-description">{{ lugar.descripcion }}</p>

      <div class="place-info">
        <div class="info-item">
          <span class="info-icon"><Target :size="16" /></span>
          <span class="info-label">Circuito:</span>
          <span class="info-value circuit-badge" :class="`circuit-${lugar.circuito}`">
            {{ lugar.circuito }}
          </span>
        </div>

        <div class="info-item">
          <span class="info-icon"><Mountain :size="16" /></span>
          <span class="info-label">Altitud:</span>
          <span class="info-value">{{ lugar.altitud }}m</span>
        </div>

        <div class="info-item">
          <span class="info-icon"><TrendingUp :size="16" /></span>
          <span class="info-label">Dificultad:</span>
          <span class="info-value difficulty-badge" :class="getDificultadClass(lugar.dificultad)">
            {{ lugar.dificultad }}
          </span>
        </div>
      </div>

      <div class="temperature-display">
        <div class="temp-current">
          <span class="temp-label">Actual</span>
          <span class="temp-value">{{ formatTemperature(lugar.tempActual) }}</span>
        </div>
        <div class="temp-range">
          <span class="temp-min">
            <span class="temp-icon"><ThermometerSnowflake :size="14" /></span>
            {{ formatTemperature(tempMinMax.min) }}
          </span>
          <span class="temp-separator">•</span>
          <span class="temp-max">
            <span class="temp-icon"><ThermometerSun :size="14" /></span>
            {{ formatTemperature(tempMinMax.max) }}
          </span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <span class="view-details">Ver pronóstico completo →</span>
    </div>
  </router-link>
</template>

<script>
import { 
  getWeatherIcon, 
  getWeatherClass, 
  formatTemp, 
  celsiusToFahrenheit,
  getDificultadColor 
} from '@utils/helpers.js';
import WeatherIcon from './WeatherIcon.vue';
import { Target, Mountain, TrendingUp, ThermometerSnowflake, ThermometerSun } from 'lucide-vue-next';

export default {
  name: 'PlaceCard',
  components: {
    WeatherIcon,
    Target,
    Mountain,
    TrendingUp,
    ThermometerSnowflake,
    ThermometerSun
  },
  props: {
    lugar: {
      type: Object,
      required: true
    },
    tempUnit: {
      type: String,
      default: 'C'
    }
  },
  computed: {
    tempMinMax() {
      if (!this.lugar.pronosticoSemanal || this.lugar.pronosticoSemanal.length === 0) {
        return { min: 0, max: 0 };
      }

      const temperaturas = this.lugar.pronosticoSemanal.flatMap(dia => [dia.min, dia.max]);
      return {
        min: Math.min(...temperaturas),
        max: Math.max(...temperaturas)
      };
    }
  },
  methods: {
    getWeatherIcon,
    getWeatherClass,
    getDificultadClass(dificultad) {
      return `difficulty-${getDificultadColor(dificultad)}`;
    },
    formatTemperature(temp) {
      if (this.tempUnit === 'F') {
        return formatTemp(celsiusToFahrenheit(temp), 'F');
      }
      return formatTemp(temp, 'C');
    },
    getWeatherIconColorClass(estado) {
      if (estado.includes('Nieve')) return 'text-snow';
      if (estado.includes('Tormenta')) return 'text-storm';
      if (estado.includes('Lluvia') || estado.includes('Lluvioso') || estado.includes('Chubascos')) return 'text-rain';
      if (estado.includes('Soleado')) return 'text-sun';
      return '';
    }
  }
};
</script>

<style scoped>
.place-card {
  display: block;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.place-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  position: relative;
  padding: 2rem 1.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header.sunny {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-header.cloudy {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-header.rainy {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.card-header.snowy {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
}

.card-header.storm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.place-icon {
  font-size: 3rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  color: white;
}

.weather-badge {
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.weather-icon {
  font-size: 1.25rem;
}

.weather-text {
  font-weight: 600;
  font-size: 0.875rem;
  color: #333;
}

.weather-icon.text-snow {
  color: #4facfe;
}

.card-body {
  padding: 1.5rem;
}

.place-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
}

.place-description {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.place-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.info-icon {
  font-size: 1rem;
  color: var(--primary);
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  font-weight: 600;
  color: #333;
}

.circuit-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.circuit-W {
  background: #e3f2fd;
  color: #1976d2;
}

.circuit-O {
  background: #fff3e0;
  color: #f57c00;
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.difficulty-success {
  background: #e8f5e9;
  color: #2e7d32;
}

.difficulty-info {
  background: #e3f2fd;
  color: #1976d2;
}

.difficulty-warning {
  background: #fff3e0;
  color: #f57c00;
}

.difficulty-orange {
  background: #fff3e0;
  color: #e65100;
}

.difficulty-danger {
  background: #ffebee;
  color: #c62828;
}

.temperature-display {
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.temp-current {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.temp-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.temp-value {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.temp-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.temp-min {
  color: #4facfe;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.temp-max {
  color: #f5576c;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.temp-icon {
  font-size: 1rem;
}

.temp-separator {
  color: #999;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: center;
}

.view-details {
  font-weight: 600;
  color: #667eea;
  font-size: 0.875rem;
  transition: transform 0.2s ease;
  display: inline-block;
}

.place-card:hover .view-details {
  transform: translateX(5px);
}

/* Responsive */
@media (max-width: 480px) {
  .place-name {
    font-size: 1.25rem;
  }

  .temp-value {
    font-size: 1.5rem;
  }
}
</style>
