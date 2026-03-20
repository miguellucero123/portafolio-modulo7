/**
 * Vue Router + rutas protegidas (Módulo 7)
 */

import { createRouter, createWebHistory } from 'vue-router';
import store from '@store/index.js';
import Home from '@views/Home.vue';
import LugarDetalle from '@views/LugarDetalle.vue';
import Login from '@views/Login.vue';
import Registro from '@views/Registro.vue';
import Favoritos from '@views/Favoritos.vue';
import PreferenciasClima from '@views/PreferenciasClima.vue';

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
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Iniciar sesión',
      guestOnly: true
    }
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro,
    meta: {
      title: 'Registro',
      guestOnly: true
    }
  },
  {
    path: '/favoritos',
    name: 'Favoritos',
    component: Favoritos,
    meta: {
      title: 'Mis favoritos',
      requiresAuth: true
    }
  },
  {
    path: '/preferencias-clima',
    name: 'PreferenciasClima',
    component: PreferenciasClima,
    meta: {
      title: 'Mis preferencias de clima',
      requiresAuth: true
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
    }
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  if (!['/login', '/registro'].includes(to.path)) {
    sessionStorage.setItem('lastRoute', to.fullPath);
  }

  document.title = to.meta.title || 'ClimaTorre - Torres del Paine';

  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    // Tras el login, la vista Login valida `redirect` con sanitizeRedirectPath (solo rutas internas).
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  if (to.meta.guestOnly && store.getters.isAuthenticated) {
    next('/');
    return;
  }

  next();
});

export default router;
