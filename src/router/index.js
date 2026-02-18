/**
 * Vue Router Configuration
 * Configuración de rutas para la SPA ClimaTorre
 * Módulo 6
 */

import { createRouter, createWebHistory } from 'vue-router';
import Home from '@views/Home.vue';
import LugarDetalle from '@views/LugarDetalle.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'ClimaTorre - Inicio'
    }
  },
  {
    path: '/lugar/:id',
    name: 'LugarDetalle',
    component: LugarDetalle,
    props: true,
    meta: {
      title: 'Detalle del Lugar'
    }
  },
  {
    // Ruta 404 - redirige al home
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Actualizar título de la página
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'ClimaTorre - Torres del Paine';
  next();
});

export default router;
