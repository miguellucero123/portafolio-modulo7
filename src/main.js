/**
 * ClimaTorre Vue SPA - Punto de entrada principal
 * Módulo 6 - SPA con Vue.js y Vue Router
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Importar estilos globales
import './styles/main.css';

// Crear y montar la aplicación Vue
const app = createApp(App);

app.use(store);
app.use(router);

// Montar en el DOM
app.mount('#app');

console.log('🌤️ ClimaTorre SPA iniciado (Vue 3 + Vuex — Módulo 7)');
