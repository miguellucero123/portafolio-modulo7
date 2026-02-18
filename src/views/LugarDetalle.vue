<template>
  <div class="detalle-view">
    <div class="container">
      <!-- Botón volver -->
      <router-link to="/" class="back-button">
        ← Volver al inicio
      </router-link>

      <!-- Mensaje de error si no se encuentra el lugar -->
      <div v-if="!lugar" class="error-message glass-card">
        <div class="error-icon"><Frown :size="64" /></div>
        <h2>Lugar no encontrado</h2>
        <p>El lugar que buscas no existe o ha sido eliminado</p>
        <router-link to="/" class="btn-primary">
          Volver al inicio
        </router-link>
      </div>

      <!-- Contenido del lugar -->
      <div v-else class="detalle-content">
        <!-- Header del lugar -->
        <header class="lugar-header glass-card" :class="getWeatherBgClass(lugar.estadoActual)">
          <div class="header-content">
            <div class="lugar-icon-large">
              <WeatherIcon :icon="lugar.icono" :size="80" :stroke-width="1.5" />
            </div>
            <div class="header-info">
              <h1 class="lugar-title">{{ lugar.nombre }}</h1>
              <p class="lugar-description">{{ lugar.descripcion }}</p>
              <div class="header-badges">
                <span class="badge circuit-badge" :class="`circuit-${lugar.circuito}`">
                  <Target :size="14" /> Circuito {{ lugar.circuito }}
                </span>
                <span class="badge altitude-badge">
                  <Mountain :size="14" /> {{ lugar.altitud }}m
                </span>
                <span class="badge difficulty-badge" :class="getDificultadClass(lugar.dificultad)">
                  <TrendingUp :size="14" /> {{ lugar.dificultad }}
                </span>
              </div>
            </div>
          </div>
        </header>

        <!-- Clima actual -->
        <section class="current-weather">
          <h2 class="section-title"><CloudSun :size="28" /> Clima Actual</h2>
          <div class="current-weather-card glass-card">
            <div class="weather-icon-large" :class="getWeatherIconColorClass(lugar.estadoActual)">
              <WeatherIcon :icon="getWeatherIcon(lugar.estadoActual)" :size="80" class="weather-icon-shadow" />
            </div>
            <div class="weather-info">
              <div class="weather-temp">
                {{ formatTemperature(lugar.tempActual) }}
              </div>
              <div class="weather-status">{{ lugar.estadoActual }}</div>
            </div>
            <div class="weather-coords">
              <div class="coord-item" v-if="lastUpdate">
                <span class="coord-label">Sincronizado:</span>
                <span class="coord-value text-small">{{ formattedLastUpdate }}</span>
              </div>
              <div class="coord-item">
                <span class="coord-label">Sensación Térmica:</span>
                <span class="coord-value">{{ formatTemperature(sensacionTermica) }}</span>
              </div>
              <div class="coord-item">
                <span class="coord-label">Latitud:</span>
                <span class="coord-value">{{ lugar.coordenadas.lat }}°</span>
              </div>
              <div class="coord-item">
                <span class="coord-label">Longitud:</span>
                <span class="coord-value">{{ lugar.coordenadas.lon }}°</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Estadísticas de la semana -->
        <section class="estadisticas-section">
          <h2 class="section-title"><BarChart2 :size="28" /> Estadísticas de la Semana</h2>
          
          <!-- Gráfico de Tendencia de Temperatura (SVG) -->
          <div class="trend-chart-container glass-card mb-4" v-if="chartData.points.length > 0">
            <h3>Tendencia de Temperatura</h3>
            <div class="chart-wrapper">
              <svg viewBox="0 0 800 200" class="temp-chart">
                <!-- Grid Lines -->
                <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.1)" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.1)" />
                <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.1)" />
                
                <!-- Max Temp Line -->
                <polyline 
                  fill="none" 
                  stroke="#f5576c" 
                  stroke-width="3" 
                  :points="chartData.maxPoints" 
                />
                <!-- Min Temp Line -->
                <polyline 
                  fill="none" 
                  stroke="#4facfe" 
                  stroke-width="3" 
                  :points="chartData.minPoints" 
                />
                
                <!-- Data Points Max -->
                <circle 
                  v-for="(point, i) in chartData.points" 
                  :key="`max-${i}`" 
                  :cx="point.x" 
                  :cy="point.yMax" 
                  r="4" 
                  fill="#f5576c" 
                />
                <!-- Data Points Min -->
                 <circle 
                  v-for="(point, i) in chartData.points" 
                  :key="`min-${i}`" 
                  :cx="point.x" 
                  :cy="point.yMin" 
                  r="4" 
                  fill="#4facfe" 
                />
                
                <!-- Labels -->
                 <text 
                  v-for="(point, i) in chartData.points" 
                  :key="`label-${i}`" 
                  :x="point.x" 
                  y="190" 
                  fill="white" 
                  text-anchor="middle" 
                  font-size="12"
                >{{ point.day.substring(0, 3) }}</text>
              </svg>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="dot max"></span> Máxima</span>
              <span class="legend-item"><span class="dot min"></span> Mínima</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-box glass-card">
              <div class="stat-icon"><ThermometerSnowflake :size="32" /></div>
              <div class="stat-label">Temperatura Mínima</div>
              <div class="stat-value">{{ formatTemperature(estadisticas.tempMin) }}</div>
            </div>
            <div class="stat-box glass-card">
              <div class="stat-icon"><ThermometerSun :size="32" /></div>
              <div class="stat-label">Temperatura Máxima</div>
              <div class="stat-value">{{ formatTemperature(estadisticas.tempMax) }}</div>
            </div>
            <div class="stat-box glass-card">
              <div class="stat-icon"><Thermometer :size="32" /></div>
              <div class="stat-label">Temperatura Promedio</div>
              <div class="stat-value">{{ formatTemperature(estadisticas.tempPromedio) }}</div>
            </div>
            <div class="stat-box glass-card">
              <div class="stat-icon">
                <WeatherIcon :icon="getWeatherIcon(estadisticas.estadoMasFrecuente)" :size="32" />
              </div>
              <div class="stat-label">Estado más Frecuente</div>
              <div class="stat-value text-small">{{ estadisticas.estadoMasFrecuente }}</div>
            </div>
            <div class="stat-box glass-card" v-if="estadisticas.precipitacionPromedio">
              <div class="stat-icon"><Droplets :size="32" /></div>
              <div class="stat-label">Precipitación Promedio</div>
              <div class="stat-value">{{ estadisticas.precipitacionPromedio }}%</div>
            </div>
            <div class="stat-box glass-card" v-if="estadisticas.vientoPromedio">
              <div class="stat-icon"><Wind :size="32" /></div>
              <div class="stat-label">Viento Promedio</div>
              <div class="stat-value">{{ estadisticas.vientoPromedio }} km/h</div>
            </div>
          </div>

          <!-- Resumen textual -->
          <div class="resumen-box glass-card">
            <p class="resumen-text">{{ resumenPronostico }}</p>
          </div>
        </section>

        <!-- Pronóstico semanal -->
        <section class="pronostico-section">
          <h2 class="section-title"><Calendar :size="28" /> Pronóstico 7 Días</h2>
          
          <!-- Opciones de visualización -->
          <div class="view-options">
            <button 
              :class="['view-btn', { active: vistaPronostico === 'cards' }]"
              @click="vistaPronostico = 'cards'"
            >
              <LayoutGrid :size="16" /> Tarjetas
            </button>
            <button 
              :class="['view-btn', { active: vistaPronostico === 'table' }]"
              @click="vistaPronostico = 'table'"
            >
              <List :size="16" /> Tabla
            </button>
          </div>

          <!-- Vista de tarjetas -->
          <div v-if="vistaPronostico === 'cards'" class="forecast-cards">
            <div 
              v-for="(dia, index) in lugar.pronosticoSemanal" 
              :key="index"
              class="forecast-card glass-card clickable"
              :class="getWeatherClass(dia.estado)"
              @click="openDayDetail(dia)"
            >
              <div class="forecast-day">{{ dia.dia }}</div>
              <div class="forecast-icon">
                <WeatherIcon :icon="getWeatherIcon(dia.estado)" :size="40" />
              </div>
              <div class="forecast-status">{{ dia.estado }}</div>
              <div class="forecast-temps">
                <span class="temp-max">{{ formatTemperature(dia.max) }}</span>
                <span class="temp-separator">/</span>
                <span class="temp-min">{{ formatTemperature(dia.min) }}</span>
              </div>
              <div v-if="dia.precipitacion" class="forecast-detail">
                <Droplets :size="12" /> {{ dia.precipitacion }}%
              </div>
              <div v-if="dia.viento" class="forecast-detail">
                <Wind :size="12" /> {{ dia.viento }} km/h
              </div>
            </div>
          </div>

          <!-- Vista de tabla -->
          <div v-else class="forecast-table-container">
            <table class="forecast-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Estado</th>
                  <th>Temp. Min</th>
                  <th>Temp. Max</th>
                  <th v-if="lugar.pronosticoSemanal[0].precipitacion">Lluvia</th>
                  <th v-if="lugar.pronosticoSemanal[0].viento">Viento</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(dia, index) in lugar.pronosticoSemanal" 
                  :key="index"
                  :class="[getWeatherClass(dia.estado), 'clickable']"
                  @click="openDayDetail(dia)"
                >
                  <td class="td-day">{{ dia.dia }}</td>
                  <td class="td-status">
                    <span class="status-icon">
                      <WeatherIcon :icon="getWeatherIcon(dia.estado)" :size="20" class="text-primary" />
                    </span>
                    {{ dia.estado }}
                  </td>
                  <td class="td-temp">{{ formatTemperature(dia.min) }}</td>
                  <td class="td-temp">{{ formatTemperature(dia.max) }}</td>
                  <td v-if="dia.precipitacion" class="td-detail">{{ dia.precipitacion }}%</td>
                  <td v-if="dia.viento" class="td-detail">{{ dia.viento }} km/h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Distribución de estados -->
        <section class="distribucion-section">
          <h2 class="section-title"><BarChart2 :size="28" /> Distribución de Estados Climáticos</h2>
          <div class="distribucion-bars">
            <div 
              v-for="(cantidad, estado) in estadisticas.diasPorEstado" 
              :key="estado"
              class="distribucion-bar"
            >
              <div class="bar-label">
                <span class="bar-icon">
                  <WeatherIcon :icon="getWeatherIcon(estado)" :size="20" class="text-primary" />
                </span>
                <span class="bar-text">{{ estado }}</span>
              </div>
              <div class="bar-container">
                <div 
                  class="bar-fill" 
                  :class="getWeatherClass(estado)"
                  :style="{ width: `${(cantidad / 7) * 100}%` }"
                >
                  <span class="bar-value">{{ cantidad }} día{{ cantidad !== 1 ? 's' : '' }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Recomendaciones -->
        <section class="recomendaciones-section">
          <h2 class="section-title"><Lightbulb :size="28" /> Recomendaciones</h2>
          <div class="recomendaciones-grid">
            <div class="recomendacion-card glass-card">
              <div class="rec-icon"><Backpack :size="32" class="text-primary" /></div>
              <h3>Equipo Sugerido</h3>
              <ul>
                <li v-for="item in equipoSugerido" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="recomendacion-card glass-card">
              <div class="rec-icon"><AlertTriangle :size="32" class="text-danger" /></div>
              <h3>Precauciones</h3>
              <ul>
                <li v-for="precaucion in precauciones" :key="precaucion">{{ precaucion }}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>

    <!-- Modal Detalle Día -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content glass-card">
        <button class="close-btn" @click="showModal = false">×</button>
        
        <div class="modal-header" v-if="selectedDay">
          <h3>{{ selectedDay.dia }}</h3>
          <div class="modal-summary">
            <WeatherIcon :icon="getWeatherIcon(selectedDay.estado)" :size="48" class="text-primary" />
            <div class="modal-temps">
              <span class="modal-max">{{ formatTemperature(selectedDay.max) }}</span>
              <span class="modal-min">{{ formatTemperature(selectedDay.min) }}</span>
            </div>
          </div>
        </div>

        <div class="modal-body" v-if="selectedDayHourly">
          <h4>Pronóstico por Horas</h4>
          <div class="hourly-grid">
            <div 
              v-for="(hour, index) in selectedDayHourly" 
              :key="index" 
              class="hourly-item"
            >
              <div class="hour-time">{{ hour.time }}</div>
              <WeatherIcon :icon="getWeatherIcon(hour.condition)" :size="24" class="text-primary" />
              <div class="hour-temp">{{ formatTemperature(hour.temp) }}</div>
              <div class="hour-wind">
                <Wind :size="12" /> {{ hour.wind }} km/h
              </div>
            </div>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import { useWeather } from '@composables/useWeather.js';
import { 
  getWeatherIcon, 
  getWeatherClass, 
  formatTemp, 
  celsiusToFahrenheit,
  calculateWindChill,
  calcularEstadisticas,
  generarResumenPronostico,
  generateHourlyForecast,
  getDificultadColor
} from '@utils/helpers.js';
import WeatherIcon from '@components/WeatherIcon.vue';
import { 
  Frown, Target, Mountain, TrendingUp, CloudSun, BarChart2, 
  ThermometerSnowflake, ThermometerSun, Thermometer, Droplets, 
  Wind, Lightbulb, Backpack, AlertTriangle, Calendar, LayoutGrid, List 
} from 'lucide-vue-next';

export default {
  name: 'LugarDetalle',
  components: {
    WeatherIcon,
    Frown, Target, Mountain, TrendingUp, CloudSun, BarChart2, 
    ThermometerSnowflake, ThermometerSun, Thermometer, Droplets, 
    Wind, Lightbulb, Backpack, AlertTriangle, Calendar, LayoutGrid, List
  },
  props: {
    id: {
      type: String,
      required: true
    },
    tempUnit: {
      type: String,
      default: 'C'
    }
  },
  setup() {
    const { getLugarById, lastUpdate, fetchWeather, loading } = useWeather();
    return { getLugarById, lastUpdate, fetchWeather, loading };
  },
  data() {
    return {
      vistaPronostico: 'cards', // 'cards' o 'table'
      showModal: false,
      selectedDay: null,
      selectedDayHourly: []
    };
  },
  computed: {
    lugar() {
      // Usamos el computed que retorna el composable
      return this.getLugarById(this.id).value;
    },
    estadisticas() {
      if (!this.lugar) return null;
      return calcularEstadisticas(this.lugar.pronosticoSemanal);
    },
    resumenPronostico() {
      return generarResumenPronostico(this.estadisticas);
    },
    sensacionTermica() {
      if (!this.lugar || !this.estadisticas) return 0;
      // Usamos el viento promedio de la semana como aproximación si no hay dato actual de viento
      // En un caso real, 'lugar' tendría 'vientoActual'
      const viento = this.estadisticas.vientoPromedio || 10; 
      return calculateWindChill(this.lugar.tempActual, viento);
    },
    equipoSugerido() {
      if (!this.estadisticas) return [];
      
      const equipo = ['Mochila de trekking', 'Botella de agua (mín 1.5L)', 'Protector solar y lentes UV'];
      
      // Lluvia
      if (this.estadisticas.diasPorEstado['Lluvioso'] >= 2 || this.estadisticas.precipitacionPromedio > 30) {
        equipo.push('Chaqueta impermeable (Hardshell)');
        equipo.push('Pantalones impermeables');
        equipo.push('Cubre mochila');
        equipo.push('Polainas (Gaiters)');
      }

      // Frío y Viento (Wind Chill)
      if (this.estadisticas.tempMin < 5 || this.sensacionTermica < 5) {
        equipo.push('Primera capa térmica (Mino/Sintético)');
        equipo.push('Chaqueta de pluma o sintética (Puffy)');
        equipo.push('Gorro de abrigo y guantes');
      }

      // Viento Extremo
      if (this.estadisticas.vientoPromedio > 40) {
        equipo.push('Cortavientos resistente');
        equipo.push('Bastones de trekking (esenciales)');
        equipo.push('Anclajes para carpa (si acampas)');
      }

      // Terreno difícil
      if (this.lugar.dificultad === 'Alta' || this.lugar.dificultad === 'Media-Alta') {
        equipo.push('Botas de trekking con caña alta');
        equipo.push('Linterna frontal con baterías extra');
        equipo.push('Botiquín de primeros auxilios personal');
      }
      
      return equipo;
    },
    precauciones() {
      if (!this.estadisticas) return [];
      
      const precauciones = ['Informar ruta a guardaparques (CONAF)'];
      
      // Sensación Térmica baja
      if (this.sensacionTermica < 0) {
        precauciones.push('RIESGO DE HIPOTERMIA: Sensación térmica bajo cero.');
        precauciones.push('Mantenerse seco y abrigado. Evitar paradas largas.');
      } else if (this.sensacionTermica < 5) {
        precauciones.push('Sensación térmica baja. Usar sistema de capas.');
      }

      // Viento
      if (this.estadisticas.vientoPromedio > 60) {
        precauciones.push('PELIGRO: Ráfagas de viento extremas (>60 km/h).');
        precauciones.push('Evitar senderos expuestos y pasos de altura.');
      } else if (this.estadisticas.vientoPromedio > 40) {
        precauciones.push('Viento fuerte. Precaución en zonas expuestas.');
      }

      // Lluvia / Nieve
      if (this.estadisticas.precipitacionPromedio > 60) {
        precauciones.push('Riesgo de senderos embarrados y resbalosos.');
        precauciones.push('Cruces de ríos pueden estar crecidos.');
      }

      // UV
      if (this.estadisticas.estadoMasFrecuente === 'Soleado') {
        precauciones.push('Radiación UV alta. Reaplicar protector solar cada 2h.');
      }
      
      return precauciones;
    },
    chartData() {
      if (!this.lugar) return { points: [], maxPoints: '', minPoints: '' };
      
      const points = this.lugar.pronosticoSemanal.map((dia, index) => {
        const x = (index * 100) + 50; // Spacing
        // Map temp to Y (assuming range -5 to 25 approx for plotting comfortably)
        // 0 at 180, 20 at 20
        const scaleY = (temp) => 180 - ((temp + 5) * 6); 
        return {
          day: dia.dia,
          x,
          yMax: scaleY(dia.max),
          yMin: scaleY(dia.min),
          max: dia.max,
          min: dia.min
        };
      });

      const maxPoints = points.map(p => `${p.x},${p.yMax}`).join(' ');
      const minPoints = points.map(p => `${p.x},${p.yMin}`).join(' ');

      return { points, maxPoints, minPoints };
    },
    formattedLastUpdate() {
      if (!this.lastUpdate) return '';
      return new Intl.DateTimeFormat('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(this.lastUpdate);
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
    openDayDetail(day) {
      this.selectedDay = day;
      this.selectedDayHourly = generateHourlyForecast(day);
      this.showModal = true;
    },
    getWeatherBgClass(estado) {
      return `bg-${getWeatherClass(estado)}`;
    },
    getWeatherIconColorClass(estado) {
      if (estado.includes('Nieve')) return 'text-snow';
      if (estado.includes('Tormenta')) return 'text-storm';
      if (estado.includes('Lluvia') || estado.includes('Lluvioso') || estado.includes('Chubascos')) return 'text-rain';
      if (estado.includes('Soleado')) return 'text-sun';
      return '';
    }
  },
  mounted() {
    // Scroll to top al montar el componente
    window.scrollTo(0, 0);
    
    // Asegurar que tenemos datos actualizados
    this.fetchWeather();
    
    // Actualizar título de la página
    if (this.lugar) {
      document.title = `${this.lugar.nombre} - ClimaTorre`;
    }
  }
};
</script>

<style scoped>
.detalle-view {
  min-height: 100vh;
  padding-bottom: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Back Button */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  transform: translateX(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Error Message */
.error-message {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--warning);
}

.error-message h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.error-message p {
  color: #666;
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

/* Header del Lugar */
.lugar-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.6s ease;
}

.lugar-header.sunny {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.lugar-header.cloudy {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.lugar-header.rainy {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.lugar-header.snowy {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
}

.lugar-header.storm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-header.snowy {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
}

.card-header.storm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-content {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.lugar-icon-large {
  font-size: 6rem;
  filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.3));
}

.header-info {
  flex: 1;
}

.lugar-title {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.lugar-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.header-badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.circuit-W {
  color: #1976d2;
}

.circuit-O {
  color: #f57c00;
}

.altitude-badge {
  color: #5e35b1;
}

.difficulty-success {
  color: #2e7d32;
}

.difficulty-info {
  color: #1976d2;
}

.difficulty-warning {
  color: #f57c00;
}

.difficulty-orange {
  color: #e65100;
}

.difficulty-danger {
  color: #c62828;
}

/* Secciones */
.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Clima Actual */
.current-weather {
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease;
}

.current-weather-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

.weather-icon-large {
  font-size: 5rem;
  color: var(--primary);
}

.weather-info {
  text-align: center;
}

.weather-temp {
  font-size: 4rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.weather-status {
  font-size: 1.5rem;
  color: #666;
  font-weight: 600;
}

.weather-coords {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.coord-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.coord-label {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.coord-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.coord-value.text-small {
  font-size: 0.85rem;
  color: #667eea;
}

/* Estadísticas */
.estadisticas-section {
  margin-bottom: 2rem;
  animation: fadeIn 1s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-box {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-box:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  color: var(--primary);
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
}

.stat-value.text-small {
  font-size: 1.25rem;
}

.resumen-box {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.resumen-text {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
  text-align: center;
  margin: 0;
}

/* Pronóstico */
.pronostico-section {
  margin-bottom: 2rem;
  animation: fadeIn 1.2s ease;
}

.view-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.view-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid white;
  background: transparent;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.view-btn.active {
  background: white;
  color: #667eea;
}

.forecast-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.forecast-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.forecast-card:hover {
  transform: translateY(-5px);
}

.forecast-card.sunny {
  border-top: 4px solid #f5576c;
}

.forecast-card.cloudy {
  border-top: 4px solid #00f2fe;
}

.forecast-card.rainy {
  border-top: 4px solid #38f9d7;
}

.forecast-card.snowy {
  border-top: 4px solid #8ec5fc;
}

.forecast-card.storm {
  border-top: 4px solid #764ba2;
}

.forecast-day {
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.forecast-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.forecast-status {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.forecast-temps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.temp-max {
  color: #f5576c;
}

.temp-min {
  color: #4facfe;
}

.temp-separator {
  color: #999;
}

.forecast-detail {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
}

/* Tabla */
.forecast-table-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.forecast-table {
  width: 100%;
  border-collapse: collapse;
  color: #333;
}

.forecast-table thead {
  background: #f5f7fa;
}

.forecast-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.forecast-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.forecast-table tbody tr.clickable {
  cursor: pointer;
  transition: background 0.2s;
}

.forecast-table tbody tr.clickable:hover {
  background: rgba(0,0,0,0.05);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s;
}

.modal-content {
  background: white;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.modal-header h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.modal-summary {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.modal-temps {
  display: flex;
  gap: 1rem;
  font-size: 2rem;
  font-weight: 700;
}

.modal-max { color: #f5576c; }
.modal-min { color: #4facfe; }

.hourly-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.hourly-item {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.hour-time {
  font-weight: 600;
  color: #666;
  font-size: 0.875rem;
}

.hour-temp {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.hour-wind {
  font-size: 0.75rem;
  color: #999;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Trend Chart */
.trend-chart-container {
  padding: 1.5rem;
}

.trend-chart-container h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 1.25rem;
}

.chart-wrapper {
  overflow-x: auto;
}

.temp-chart {
  width: 100%;
  min-width: 600px;
  height: 200px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  color: white;
  font-size: 0.875rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot.max { background: #f5576c; }
.dot.min { background: #4facfe; }

.mb-4 {
  margin-bottom: 2rem;
}

.clickable {
  cursor: pointer;
}

.forecast-table tbody tr:hover {
  background: #f9fafb;
}

.forecast-table tr.sunny {
  background: rgba(245, 87, 108, 0.05);
}

.forecast-table tr.cloudy {
  background: rgba(0, 242, 254, 0.05);
}

.forecast-table tr.rainy {
  background: rgba(56, 249, 215, 0.05);
}

.forecast-table tr.snowy {
  background: rgba(142, 197, 252, 0.05);
}

.forecast-table tr.storm {
  background: rgba(118, 75, 162, 0.05);
}

.td-day {
  font-weight: 700;
  color: #333;
}

.td-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-icon {
  font-size: 1.5rem;
}

.td-temp {
  font-weight: 600;
  color: #667eea;
}

.td-detail {
  color: #666;
}

/* Distribución */
.distribucion-section {
  margin-bottom: 2rem;
  animation: fadeIn 1.4s ease;
}

.distribucion-bars {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.distribucion-bar {
  margin-bottom: 1.5rem;
}

.distribucion-bar:last-child {
  margin-bottom: 0;
}

.bar-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.bar-icon {
  font-size: 1.5rem;
}

.bar-container {
  background: #f0f0f0;
  border-radius: 8px;
  height: 40px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  transition: width 0.6s ease;
  color: white;
  font-weight: 600;
}

.bar-fill.sunny {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

.bar-fill.cloudy {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.bar-fill.rainy {
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
}

.bar-fill.snowy {
  background: linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%);
}

.bar-fill.storm {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

/* Recomendaciones */
.recomendaciones-section {
  animation: fadeIn 1.6s ease;
}

.recomendaciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.recomendacion-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.rec-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary);
  text-align: center;
}

.recomendacion-card h3 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.recomendacion-card ul {
  list-style: none;
  padding: 0;
}

.recomendacion-card li {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #f5f7fa;
  border-radius: 8px;
  color: #333;
  position: relative;
  padding-left: 2rem;
}

.recomendacion-card li::before {
  content: '✓';
  position: absolute;
  left: 0.75rem;
  color: #667eea;
  font-weight: 700;
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

/* Responsive */
@media (max-width: 968px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .lugar-title {
    font-size: 2rem;
  }

  .current-weather-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .weather-coords {
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
  }

  .forecast-cards {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 1rem;
  }

  .lugar-icon-large {
    font-size: 4rem;
  }

  .lugar-title {
    font-size: 1.75rem;
  }

  .weather-temp {
    font-size: 3rem;
  }

  .forecast-cards {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
