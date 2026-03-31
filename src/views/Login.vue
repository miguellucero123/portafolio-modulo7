<template>
  <div class="auth-view">
    <div class="auth-card glass-card">
      <h1 class="auth-title">
        <LogIn :size="28" class="auth-title-icon" /> Iniciar sesión
      </h1>
      <p class="auth-lead">Accede a tus favoritos y preferencias de clima.</p>

      <form class="auth-form" @submit.prevent="onSubmit">
        <label class="auth-label" for="login-email">Correo electrónico</label>
        <input
          id="login-email"
          v-model.trim="email"
          type="email"
          autocomplete="email"
          class="auth-input"
          required
          placeholder="tu@correo.cl"
        />

        <label class="auth-label" for="login-password">Contraseña</label>
        <input
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          class="auth-input"
          required
          placeholder="••••••••"
        />

        <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

        <button type="submit" class="auth-submit btn-primary" :disabled="loading">
          {{ loading ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿No tienes cuenta?
        <router-link to="/registro" class="auth-link">Regístrate</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { LogIn } from 'lucide-vue-next';
import { sanitizeRedirectPath } from '@utils/sanitizeRedirectPath.js';

export default {
  name: 'LoginView',
  components: { LogIn },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    };
  },
  methods: {
    ...mapActions(['login']),
    async onSubmit() {
      this.error = '';
      this.loading = true;
      try {
        await this.login({
          email: this.email,
          password: this.password
        });
        const q = this.$route.query.redirect;
        const fromSession = sessionStorage.getItem('lastRoute');
        const raw =
          (typeof q === 'string' && q) || fromSession || '/';
        const target = sanitizeRedirectPath(raw);
        sessionStorage.removeItem('lastRoute');
        await this.$router.replace(target);
      } catch (e) {
        this.error = e?.message || 'Usuario o contraseña incorrectos';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-view {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.auth-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.auth-title-icon {
  color: #667eea;
}

.auth-lead {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.auth-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s;
}

.auth-input:focus {
  outline: none;
  border-color: #667eea;
}

.auth-error {
  color: #b91c1c;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.auth-submit {
  margin-top: 0.5rem;
  padding: 0.85rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
}

.auth-link {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
