/**
 * Autenticación simulada en el front (rúbrica: API simulada o Axios).
 */

const REGISTERED_KEY = 'climatorre_registered_users';

/** Usuarios demo para probar login sin registro previo */
const SEED_USERS = [
  {
    id: 'u-demo',
    nombre: 'Usuario Demo',
    email: 'demo@climatorre.cl',
    password: 'demo123',
    favoriteIds: [1, 3],
    preferences: { tempUnit: 'C', theme: 'light' }
  },
  {
    id: 'u-patagonia',
    nombre: 'Explorador Patagonia',
    email: 'explorador@example.com',
    password: 'paine2025',
    favoriteIds: [2, 4, 5],
    preferences: { tempUnit: 'F', theme: 'dark' }
  }
];

function loadRegistered() {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRegistered(list) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(list));
}

function stripPassword(user) {
  if (!user) return null;
  const { password: _p, ...rest } = user;
  return rest;
}

function findByEmail(email) {
  const all = [...SEED_USERS, ...loadRegistered()];
  const normalized = String(email).trim().toLowerCase();
  return all.find((u) => u.email.toLowerCase() === normalized) || null;
}

/**
 * @returns {Promise<{ ok: boolean, user?: object, message?: string }>}
 */
export function login(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = findByEmail(email);
      if (!user || user.password !== password) {
        resolve({ ok: false, message: 'Usuario o contraseña incorrectos' });
        return;
      }
      resolve({ ok: true, user: stripPassword(user) });
    }, 350);
  });
}

/**
 * @returns {Promise<{ ok: boolean, user?: object, message?: string }>}
 */
export function register({ nombre, email, password }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const exists = findByEmail(email);
      if (exists) {
        resolve({ ok: false, message: 'Ya existe una cuenta con ese correo' });
        return;
      }
      const list = loadRegistered();
      const newUser = {
        id: `u-${Date.now()}`,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
        favoriteIds: [],
        preferences: { tempUnit: 'C', theme: 'light' }
      };
      list.push(newUser);
      saveRegistered(list);
      resolve({ ok: true, user: stripPassword(newUser) });
    }, 350);
  });
}

export default { login, register };
