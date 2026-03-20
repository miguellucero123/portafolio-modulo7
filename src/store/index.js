/**
 * Vuex: autenticación, preferencias y favoritos (Módulo 7)
 */

import { createStore } from 'vuex';
import authService from '@services/authService';

const SESSION_KEY = 'climatorre_vuex_session';

function loadPersistedSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function guestPrefsFromStorage() {
  if (typeof localStorage === 'undefined') {
    return { tempUnit: 'C', theme: 'light' };
  }
  const tu =
    localStorage.getItem('climatorre_guest_tempUnit') ||
    localStorage.getItem('tempUnit') ||
    'C';
  const themeRaw =
    localStorage.getItem('climatorre_guest_theme') || localStorage.getItem('theme');
  return {
    tempUnit: tu === 'F' ? 'F' : 'C',
    theme: themeRaw === 'dark' ? 'dark' : 'light'
  };
}

const persisted = loadPersistedSession();

const initialState = persisted?.user
  ? {
      user: persisted.user,
      preferences: {
        tempUnit: persisted.preferences?.tempUnit || 'C',
        theme: persisted.preferences?.theme || 'light'
      },
      favoriteIds: Array.isArray(persisted.favoriteIds)
        ? [...persisted.favoriteIds]
        : [...(persisted.user.favoriteIds || [])]
    }
  : {
      user: null,
      preferences: guestPrefsFromStorage(),
      favoriteIds: []
    };

function persistState(state) {
  if (!state.user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      user: state.user,
      preferences: state.preferences,
      favoriteIds: state.favoriteIds
    })
  );
}

function persistGuestPrefs(state) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('climatorre_guest_tempUnit', state.preferences.tempUnit);
  localStorage.setItem(
    'climatorre_guest_theme',
    state.preferences.theme === 'dark' ? 'dark' : 'light'
  );
  localStorage.setItem('tempUnit', state.preferences.tempUnit);
  localStorage.setItem('theme', state.preferences.theme === 'dark' ? 'dark' : 'light');
}

export default createStore({
  state: initialState,
  getters: {
    isAuthenticated: (s) => !!s.user,
    currentUser: (s) => s.user,
    preferences: (s) => s.preferences,
    favoriteIds: (s) => s.favoriteIds,
    isFavorite: (s) => (placeId) => s.favoriteIds.includes(Number(placeId))
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      if (user) {
        state.favoriteIds = Array.isArray(user.favoriteIds)
          ? [...user.favoriteIds]
          : [];
        state.preferences = {
          ...state.preferences,
          ...user.preferences
        };
      }
    },
    CLEAR_USER(state) {
      state.user = null;
      state.favoriteIds = [];
      state.preferences = guestPrefsFromStorage();
    },
    SET_PREFERENCES(state, partial) {
      state.preferences = { ...state.preferences, ...partial };
      if (state.user) {
        state.user = {
          ...state.user,
          preferences: { ...state.preferences }
        };
      }
    },
    TOGGLE_FAVORITE(state, placeId) {
      const id = Number(placeId);
      const i = state.favoriteIds.indexOf(id);
      if (i >= 0) state.favoriteIds.splice(i, 1);
      else state.favoriteIds.push(id);
      if (state.user) {
        state.user = {
          ...state.user,
          favoriteIds: [...state.favoriteIds]
        };
      }
    },
    SET_FAVORITE_IDS(state, ids) {
      state.favoriteIds = [...ids];
      if (state.user) {
        state.user = {
          ...state.user,
          favoriteIds: [...state.favoriteIds]
        };
      }
    }
  },
  actions: {
    async login({ commit, state }, { email, password }) {
      const result = await authService.login(email, password);
      if (!result.ok) {
        throw new Error(result.message || 'Error al iniciar sesión');
      }
      commit('SET_USER', {
        ...result.user,
        favoriteIds: result.user.favoriteIds || [],
        preferences: result.user.preferences || { tempUnit: 'C', theme: 'light' }
      });
      persistState(state);
    },
    async register({ commit, state }, payload) {
      const result = await authService.register(payload);
      if (!result.ok) {
        throw new Error(result.message || 'No se pudo registrar');
      }
      commit('SET_USER', {
        ...result.user,
        favoriteIds: result.user.favoriteIds || [],
        preferences: result.user.preferences || { tempUnit: 'C', theme: 'light' }
      });
      persistState(state);
    },
    logout({ commit, state }) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('climatorre_guest_tempUnit', state.preferences.tempUnit);
        localStorage.setItem(
          'climatorre_guest_theme',
          state.preferences.theme === 'dark' ? 'dark' : 'light'
        );
      }
      commit('CLEAR_USER');
      persistState(state);
    },
    updatePreferences({ commit, state }, partial) {
      commit('SET_PREFERENCES', partial);
      if (state.user) {
        persistState(state);
      } else {
        persistGuestPrefs(state);
      }
    },
    toggleFavorite({ commit, state }, placeId) {
      commit('TOGGLE_FAVORITE', placeId);
      if (state.user) persistState(state);
    }
  }
});
