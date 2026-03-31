# Despliegue en Netlify

El repositorio incluye `netlify.toml` (comando de build, carpeta `dist`, redirección SPA) y `public/_redirects` como respaldo.

## Opción A — Desde la web de Netlify (recomendado)

1. Cuenta en [https://app.netlify.com](https://app.netlify.com).
2. **Add new site** → **Import an existing project** → conectar **GitHub** y elegir el repositorio `portafolio-modulo7` (o el nombre que use).
3. Netlify detecta `netlify.toml`. Verifique:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Deploy site**. Tras el build, la URL tipo `https://nombre-aleatorio.netlify.app` quedará activa.
5. Opcional: **Domain settings** → dominio personalizado.

## Opción B — Netlify CLI (local)

```bash
npm install -g netlify-cli
netlify login
cd ruta/al/proyecto
npm run build
netlify deploy --prod --dir=dist
```

La primera vez puede pedir enlazar el sitio o crear uno nuevo.

## Comprobaciones

- Rutas como `/login` o `/favoritos` deben abrirse al recargar sin error 404 (reglas SPA en `netlify.toml`).
- Variables de entorno: este proyecto no requiere `.env` obligatorio para el build; si añade claves API, configúrelas en Netlify → **Site settings → Environment variables**.
