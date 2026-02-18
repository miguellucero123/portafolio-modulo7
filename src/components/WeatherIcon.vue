<template>
  <div class="weather-icon-container" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- SOL RADIANTE -->
    <svg v-if="icon === 'Sun'" viewBox="0 0 24 24" class="svg-icon sun-icon">
      <defs>
        <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fdbb2d" />
          <stop offset="100%" style="stop-color:#ff512f" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="5" fill="url(#sun-gradient)" />
      <g stroke="url(#sun-gradient)" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>

    <!-- NUBES -->
    <svg v-else-if="icon === 'Cloud'" viewBox="0 0 24 24" class="svg-icon cloud-icon">
      <defs>
        <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff" />
          <stop offset="100%" style="stop-color:#cbd5e1" />
        </linearGradient>
      </defs>
      <path d="M17.5 19c3.037 0 5.5-2.463 5.5-5.5 0-2.823-2.13-5.148-4.887-5.458C17.61 4.773 14.542 2 11 2a7.502 7.502 0 0 0-7.313 5.82C1.65 8.358 0 10.49 0 13c0 3.314 2.686 6 6 6h11.5z" fill="url(#cloud-gradient)" />
    </svg>

    <!-- LLUVIOSO -->
    <svg v-else-if="icon === 'CloudRain'" viewBox="0 0 24 24" class="svg-icon rain-icon">
      <defs>
        <linearGradient id="rain-cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#94a3b8" />
          <stop offset="100%" style="stop-color:#475569" />
        </linearGradient>
      </defs>
      <path d="M17.5 15c3.037 0 5.5-2.463 5.5-5.5 0-2.823-2.13-5.148-4.887-5.458C17.61 0.773 14.542 -2 11 -2a7.502 7.502 0 0 0-7.313 5.82C1.65 4.358 0 6.49 0 9c0 3.314 2.686 6 6 6h11.5z" fill="url(#rain-cloud-gradient)" />
      <g class="drops" stroke="#38f9d7" stroke-width="2" stroke-linecap="round">
        <line x1="8" y1="18" x2="6" y2="22" class="drop-1" />
        <line x1="12" y1="18" x2="10" y2="22" class="drop-2" />
        <line x1="16" y1="18" x2="14" y2="22" class="drop-3" />
      </g>
    </svg>

    <!-- NIEVE / CHUBASCOS NIEVE -->
    <svg v-else-if="icon === 'Snowflake'" viewBox="0 0 24 24" class="svg-icon snow-icon">
      <defs>
        <linearGradient id="snow-cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#f1f5f9" />
          <stop offset="100%" style="stop-color:#94a3b8" />
        </linearGradient>
      </defs>
      <path d="M17.5 15c3.037 0 5.5-2.463 5.5-5.5 0-2.823-2.13-5.148-4.887-5.458C17.61 0.773 14.542 -2 11 -2a7.502 7.502 0 0 0-7.313 5.82C1.65 4.358 0 6.49 0 9c0 3.314 2.686 6 6 6h11.5z" fill="url(#snow-cloud-gradient)" />
      <g class="flakes" fill="#8ec5fc">
        <circle cx="7" cy="19" r="1.5" class="flake-1" />
        <circle cx="12" cy="21" r="1.5" class="flake-2" />
        <circle cx="17" cy="19" r="1.5" class="flake-3" />
      </g>
    </svg>

    <!-- TORMENTA -->
    <svg v-else-if="icon === 'CloudLightning'" viewBox="0 0 24 24" class="svg-icon storm-icon">
      <defs>
        <linearGradient id="storm-cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#334155" />
          <stop offset="100%" style="stop-color:#0f172a" />
        </linearGradient>
      </defs>
      <path d="M17.5 15c3.037 0 5.5-2.463 5.5-5.5 0-2.823-2.13-5.148-4.887-5.458C17.61 0.773 14.542 -2 11 -2a7.502 7.502 0 0 0-7.313 5.82C1.65 4.358 0 6.49 0 9c0 3.314 2.686 6 6 6h11.5z" fill="url(#storm-cloud-gradient)" />
      <path d="M13 16l-3 4h4l-2 4" stroke="#fbbf24" stroke-width="2" fill="none" class="bolt" />
    </svg>

    <!-- NUBES CON SOL (PARCIAL) -->
    <svg v-else-if="icon === 'CloudSun'" viewBox="0 0 24 24" class="svg-icon partial-icon">
      <circle cx="17" cy="8" r="4" fill="url(#sun-gradient)" class="partial-sun" />
      <path d="M14.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.31-1.743-4.212-4-4.466C14.59 7.633 12.075 5.5 9 5.5a6.002 6.002 0 0 0-5.85 4.656C1.32 10.686 0 12.392 0 14.5 0 17.206 2.194 19.4 4.9 19.4h9.6z" fill="url(#cloud-gradient)" />
    </svg>

    <!-- ICONOS BASE (Lugar identity) -->
    <component v-else :is="iconComponent" :size="size" :class="customClass" :stroke-width="strokeWidth" />
  </div>
</template>

<script>
import { 
  Mountain, Trees, Home, Tent, MountainSnow, Search, X, MapPin, 
  Thermometer, Frown, RefreshCw, BarChart2, Backpack, AlertTriangle, 
  Calendar, LayoutGrid, List, CloudSun, Target, TrendingUp, 
  ThermometerSnowflake, ThermometerSun, Droplets, Wind, Lightbulb
} from 'lucide-vue-next';

export default {
  name: 'WeatherIcon',
  components: { 
    Mountain, Trees, Home, Tent, MountainSnow, Search, X, MapPin, 
    Thermometer, Frown, RefreshCw, BarChart2, Backpack, AlertTriangle, 
    Calendar, LayoutGrid, List, CloudSun, Target, TrendingUp, 
    ThermometerSnowflake, ThermometerSun, Droplets, Wind, Lightbulb
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    customClass: {
      type: String,
      default: ''
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  },
  computed: {
    iconComponent() {
      const map = {
        'Mountain': Mountain,
        'Trees': Trees,
        'Home': Home,
        'Tent': Tent,
        'MountainSnow': MountainSnow,
        'Target': Target,
        'TrendingUp': TrendingUp,
        'ThermometerSnowflake': ThermometerSnowflake,
        'ThermometerSun': ThermometerSun,
        'Droplets': Droplets,
        'Wind': Wind,
        'Lightbulb': Lightbulb,
        'Backpack': Backpack,
        'AlertTriangle': AlertTriangle,
        'Calendar': Calendar,
        'LayoutGrid': LayoutGrid,
        'List': List,
        'RefreshCw': RefreshCw,
        'Search': Search,
        'X': X,
        'MapPin': MapPin,
        'Thermometer': Thermometer,
        'Frown': Frown,
        'BarChart2': BarChart2
      };
      return map[this.icon] || null;
    }
  }
};
</script>

<style scoped>
.weather-icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.svg-icon {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

/* Animaciones */
.sun-icon {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cloud-icon {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.rain-icon .drop-1 { animation: fall 1s infinite 0.1s; }
.rain-icon .drop-2 { animation: fall 1s infinite 0.4s; }
.rain-icon .drop-3 { animation: fall 1s infinite 0.7s; }

@keyframes fall {
  0% { transform: translateY(-5px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(5px); opacity: 0; }
}

.snow-icon [class^="flake"] {
  animation: flakeFall 3s linear infinite;
}

.snow-icon .flake-2 { animation-delay: 1s; }
.snow-icon .flake-3 { animation-delay: 2s; }

@keyframes flakeFall {
  0% { transform: translate(0, -10px); opacity: 0; }
  50% { opacity: 1; transform: translate(2px, 0); }
  100% { transform: translate(0, 10px); opacity: 0; }
}

.storm-icon .bolt {
  animation: flash 2s step-end infinite;
}

@keyframes flash {
  0%, 100% { opacity: 0; }
  10%, 20% { opacity: 1; }
}

.partial-sun {
  animation: rotate 15s linear infinite;
}
</style>
