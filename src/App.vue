<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <router-link to="/" class="brand-link">
            <span class="brand-icon"><Mountain :size="32" /></span>
            <span class="brand-text">ClimaTorre</span>
          </router-link>
          <span class="brand-subtitle">Torres del Paine Weather</span>
        </div>

        <div class="navbar-actions">
          <nav class="navbar-auth" aria-label="Cuenta">
            <template v-if="isAuthenticated">
              <router-link to="/favoritos" class="nav-link">Favoritos</router-link>
              <router-link to="/preferencias-clima" class="nav-link">Preferencias</router-link>
              <span class="user-pill">{{ user.nombre }}</span>
              <button type="button" class="btn-logout" @click="onLogout">Cerrar sesión</button>
            </template>
            <template v-else>
              <router-link to="/login" class="nav-link">Iniciar sesión</router-link>
              <router-link to="/registro" class="nav-link">Registro</router-link>
            </template>
          </nav>

          <!-- Selector de unidad de temperatura (Vuex: preferences.tempUnit) -->
          <div class="temp-unit-selector">
            <button 
              type="button"
              :class="['unit-btn', { active: preferences.tempUnit === 'C' }]"
              @click="setTempUnit('C')"
            >
              °C
            </button>
            <button 
              type="button"
              :class="['unit-btn', { active: preferences.tempUnit === 'F' }]"
              @click="setTempUnit('F')"
            >
              °F
            </button>
          </div>

          <!-- Toggle tema (Vuex: preferences.theme) -->
          <button 
            type="button"
            class="theme-toggle" 
            @click="toggleTheme"
            :title="isDarkMode ? 'Modo claro' : 'Modo oscuro'"
          >
            <Sun v-if="isDarkMode" :size="20" />
            <Moon v-else :size="20" />
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenido principal con RouterView -->
    <main class="main-content">
      <router-view :temp-unit="preferences.tempUnit" />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>
          <strong>ClimaTorre</strong> - Aplicación SPA con Vue.js | 
          Módulo 7 Portafolio
        </p>
        <p class="footer-links">
          <a href="https://github.com/miguellucero123/portafolio-modulo7" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span class="separator">•</span>
          <span>Torres del Paine, Chile</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { Mountain, Sun, Moon } from 'lucide-vue-next';

export default {
  name: 'App',
  components: {
    Mountain,
    Sun,
    Moon
  },
  computed: {
    ...mapState(['user', 'preferences']),
    ...mapGetters(['isAuthenticated']),
    isDarkMode() {
      return this.preferences.theme === 'dark';
    }
  },
  methods: {
    ...mapActions(['updatePreferences', 'logout']),
    setTempUnit(tempUnit) {
      this.updatePreferences({ tempUnit });
    },
    toggleTheme() {
      const next = this.isDarkMode ? 'light' : 'dark';
      this.updatePreferences({ theme: next });
    },
    onLogout() {
      this.logout();
      if (this.$route.meta?.requiresAuth) {
        this.$router.push('/');
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: background 0.3s ease;
}

#app.dark-mode {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

/* Navbar */
.navbar {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.dark-mode .navbar {
  background: rgba(26, 26, 46, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #333;
  transition: transform 0.2s ease;
}

.dark-mode .brand-link {
  color: #fff;
}

.brand-link:hover {
  transform: scale(1.05);
}

.brand-icon {
  font-size: 2rem;
}

.brand-text {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.dark-mode .brand-subtitle {
  color: #aaa;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.navbar-auth {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.nav-link {
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
}

.dark-mode .nav-link {
  color: #e2e8f0;
}

.user-pill {
  font-size: 0.8rem;
  font-weight: 600;
  color: #c7d2fe;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-logout {
  font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.18);
}

/* Selector de temperatura */
.temp-unit-selector {
  display: flex;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.dark-mode .temp-unit-selector {
  background: #2a2a3e;
}

.unit-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.2s ease;
}

.dark-mode .unit-btn {
  color: #aaa;
}

.unit-btn.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.unit-btn:hover:not(.active) {
  background: #e0e0e0;
}

.dark-mode .unit-btn:hover:not(.active) {
  background: #3a3a4e;
}

/* Theme toggle */
.theme-toggle {
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.dark-mode .theme-toggle {
  background: #2a2a3e;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem 0;
}

/* Footer */
.footer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem 0;
  margin-top: 3rem;
}

.dark-mode .footer {
  background: rgba(26, 26, 46, 0.95);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  color: #666;
}

.dark-mode .footer-content {
  color: #aaa;
}

.footer-content strong {
  color: #333;
}

.dark-mode .footer-content strong {
  color: #fff;
}

.footer-links {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.footer-links a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #764ba2;
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }

  .navbar-brand {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .brand-text {
    font-size: 1.5rem;
  }

  .main-content {
    padding: 1rem 0;
  }
}
</style>
