# 🚀 Instrucciones para Ejecutar ClimaTorre

Esta guía te mostrará cómo ejecutar la aplicación ClimaTorre en tu entorno local.

## 📋 Requisitos Previos

- **Navegador web moderno** (Chrome, Firefox, Edge, Safari)
- **Node.js** (opcional, solo si quieres compilar SASS o usar un servidor local)
- **Git** (opcional, solo si clonaste el repositorio)

---

## 🎯 Método 1: Abrir Directamente en el Navegador (Más Simple)

Este es el método más rápido para probar la aplicación:

1. **Abre el archivo `index.html`** directamente en tu navegador:
   - Haz doble clic en `index.html`
   - O arrastra el archivo a la ventana del navegador
   - O haz clic derecho → "Abrir con" → Selecciona tu navegador

2. **¡Listo!** La aplicación debería cargar automáticamente.

⚠️ **Nota**: Si tienes problemas con CORS (por ejemplo, si la consola muestra errores de "CORS policy"), necesitarás usar un servidor local (Método 2 o 3).

---

## 🌐 Método 2: Usar un Servidor Local Simple

### Opción A: Con Python (Recomendado si ya tienes Python)

#### Python 3.x:
```bash
# Navega a la carpeta del proyecto
cd ruta/a/modulo5_portafolio

# Inicia el servidor
python -m http.server 8000
```

#### Python 2.x:
```bash
python -m SimpleHTTPServer 8000
```

Luego abre tu navegador en: **http://localhost:8000**

---

### Opción B: Con Node.js (http-server)

```bash
# Instala http-server globalmente (solo la primera vez)
npm install -g http-server

# Navega a la carpeta del proyecto
cd ruta/a/modulo5_portafolio

# Inicia el servidor
http-server -p 8000
```

Luego abre tu navegador en: **http://localhost:8000**

---

### Opción C: Con PHP (si tienes PHP instalado)

```bash
# Navega a la carpeta del proyecto
cd ruta/a/modulo5_portafolio

# Inicia el servidor
php -S localhost:8000
```

Luego abre tu navegador en: **http://localhost:8000**

---

## 🔧 Método 3: Con VS Code Live Server (Recomendado para Desarrollo)

Si usas **Visual Studio Code**:

1. **Instala la extensión "Live Server"**:
   - Abre VS Code
   - Ve a Extensiones (Ctrl+Shift+X)
   - Busca "Live Server" por Ritwick Dey
   - Haz clic en "Install"

2. **Abre el proyecto**:
   - Archivo → Abrir Carpeta
   - Selecciona la carpeta `modulo5_portafolio`

3. **Inicia Live Server**:
   - Haz clic derecho en `index.html`
   - Selecciona "Open with Live Server"
   - O usa el botón "Go Live" en la barra inferior

4. **¡Listo!** La aplicación se abrirá automáticamente en tu navegador.

---

## 📦 Compilar SASS (Opcional)

Si modificas archivos `.scss` y necesitas compilar el CSS:

```bash
# Instala las dependencias (solo la primera vez)
npm install

# Compila SASS una vez
npm run build-css

# O compila y observa cambios automáticamente
npm run watch-css
```

---

## 🔍 Verificar que Todo Funciona

Una vez que la aplicación esté ejecutándose:

1. ✅ Deberías ver el título "ClimaTorre" en la parte superior
2. ✅ Deberían aparecer tarjetas con ciudades y sus temperaturas
3. ✅ Puedes hacer clic en una ciudad para ver el detalle
4. ✅ En la vista de detalle deberías ver:
   - Pronóstico semanal (7 días)
   - Estadísticas de la semana
   - Alertas de clima (si aplican)

---

## 🐛 Solución de Problemas

### Error: "Failed to fetch" o errores de CORS
**Solución**: Usa un servidor local (Métodos 2 o 3) en lugar de abrir el archivo directamente.

### Error: "Cannot read property of undefined"
**Solución**: Verifica que todos los archivos JavaScript estén cargándose correctamente. Abre la consola del navegador (F12) y revisa los errores.

### No aparecen las ciudades
**Solución**: 
1. Abre la consola del navegador (F12)
2. Verifica que la API de Open-Meteo esté respondiendo
3. Revisa la pestaña "Network" para ver si hay errores en las peticiones

### Los estilos no se ven
**Solución**: 
1. Verifica que el archivo `css/main.css` exista
2. Si lo modificaste, compila SASS: `npm run build-css`
3. Revisa la consola del navegador por errores de carga de CSS

---

## 📱 Probar en Dispositivos Móviles

Si quieres probar la aplicación en tu teléfono/tablet:

1. **Asegúrate de que tu computadora y dispositivo estén en la misma red WiFi**

2. **Encuentra tu IP local**:
   - Windows: Abre CMD y ejecuta `ipconfig`, busca "IPv4 Address"
   - Mac/Linux: Abre Terminal y ejecuta `ifconfig` o `ip addr`, busca "inet"

3. **Inicia el servidor**:
   ```bash
   # Permite conexiones desde otras IPs
   python -m http.server 8000 --bind 0.0.0.0
   # O con http-server
   http-server -p 8000 -a 0.0.0.0
   ```

4. **En tu dispositivo móvil**, abre el navegador y ve a: `http://TU_IP:8000`
   - Ejemplo: `http://192.168.1.100:8000`

---

## ✅ Checklist de Ejecución

- [ ] Navegador abierto
- [ ] Servidor local ejecutándose (si es necesario)
- [ ] URL correcta (http://localhost:8000 o similar)
- [ ] Consola del navegador sin errores críticos
- [ ] Ciudades cargando correctamente
- [ ] Navegación funcionando

---

## 🎉 ¡Listo!

Ahora deberías poder usar ClimaTorre sin problemas. Si encuentras algún error, revisa la consola del navegador (F12) para más detalles.

**¿Necesitas ayuda?** Revisa la documentación en el `README.md` o los comentarios en el código.
