/**
 * Restringe la ruta post-login a navegación interna de la SPA (rúbrica: redirect tras login).
 * Evita valores maliciosos en ?redirect= (p. ej. otras origen).
 *
 * @param {unknown} path
 * @returns {string}
 */
export function sanitizeRedirectPath(path) {
  if (typeof path !== 'string' || !path.trim()) return '/';
  const t = path.trim();
  if (!t.startsWith('/')) return '/';
  if (t.startsWith('//')) return '/';
  if (t.includes('://')) return '/';
  return t;
}
