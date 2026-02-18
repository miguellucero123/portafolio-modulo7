/**
 * ClimaTorre Vue SPA - Punto de entrada principal
 * Módulo 6 - SPA con Vue.js y Vue Router
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importar estilos globales
import './styles/main.css';

// Crear y montar la aplicación Vue
const app = createApp(App);

// Usar Vue Router
app.use(router);

// Montar en el DOM
app.mount('#app');

console.log('🌤️ ClimaTorre SPA iniciado correctamente (Vue.js Módulo 6)');
