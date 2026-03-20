<template>
  <div class="prefs-view">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">
          <Settings2 :size="40" class="header-icon" /> Mis preferencias de clima
        </h1>
        <p class="page-description">
          Unidad de temperatura y tema de la interfaz se guardan en Vuex y persisten con tu sesión.
        </p>
      </header>

      <div class="prefs-card glass-card">
        <section class="pref-block">
          <h2>Unidad de temperatura</h2>
          <p class="pref-desc">Afecta a tarjetas, detalle y estadísticas.</p>
          <div class="temp-unit-selector">
            <button
              type="button"
              :class="['unit-btn', { active: preferences.tempUnit === 'C' }]"
              @click="setUnit('C')"
            >
              °C
            </button>
            <button
              type="button"
              :class="['unit-btn', { active: preferences.tempUnit === 'F' }]"
              @click="setUnit('F')"
            >
              °F
            </button>
          </div>
        </section>

        <section class="pref-block">
          <h2>Tema de la interfaz</h2>
          <p class="pref-desc">Claro u oscuro (sincronizado con la barra superior).</p>
          <div class="theme-row">
            <button type="button" class="theme-choice" :class="{ active: preferences.theme === 'light' }" @click="setTheme('light')">
              <Sun :size="22" /> Claro
            </button>
            <button type="button" class="theme-choice" :class="{ active: preferences.theme === 'dark' }" @click="setTheme('dark')">
              <Moon :size="22" /> Oscuro
            </button>
          </div>
        </section>

        <p class="prefs-note">
          Estado leído desde Vuex: <code>preferences.tempUnit</code> y <code>preferences.theme</code>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Settings2, Sun, Moon } from 'lucide-vue-next';

export default {
  name: 'PreferenciasClimaView',
  components: { Settings2, Sun, Moon },
  computed: {
    ...mapState({
      preferences: (s) => s.preferences
    })
  },
  methods: {
    ...mapActions(['updatePreferences']),
    setUnit(tempUnit) {
      this.updatePreferences({ tempUnit });
    },
    setTheme(theme) {
      this.updatePreferences({ theme });
    }
  }
};
</script>

<style scoped>
.prefs-view {
  min-height: 60vh;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.header-icon {
  color: #a5b4fc;
}

.page-description {
  color: rgba(255, 255, 255, 0.95);
  margin-top: 0.75rem;
  line-height: 1.5;
}

.prefs-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.pref-block {
  margin-bottom: 2rem;
}

.pref-block h2 {
  font-size: 1.15rem;
  color: #1e293b;
  margin-bottom: 0.35rem;
}

.pref-desc {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.temp-unit-selector {
  display: inline-flex;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.unit-btn {
  padding: 0.5rem 1.25rem;
  border: none;
  background: transparent;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s ease;
}

.unit-btn.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.35);
}

.theme-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.theme-choice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  color: #334155;
  transition: all 0.2s ease;
}

.theme-choice.active {
  border-color: #667eea;
  background: #eef2ff;
  color: #4338ca;
}

.prefs-note {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.prefs-note code {
  font-size: 0.75rem;
  background: #f1f5f9;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
}
</style>
