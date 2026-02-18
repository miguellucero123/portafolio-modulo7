# Carpeta Backup - Archivos No Utilizados

Esta carpeta contiene **copias de seguridad** de archivos que actualmente **NO están en uso activo** en el proyecto.

## ⚠️ IMPORTANTE

- ✅ Los archivos originales **permanecen en su ubicación original**
- ✅ Este backup es solo una **copia de seguridad**
- ✅ Puedes eliminar estos archivos de backup sin afectar el proyecto

---

## 📋 Archivos en este Backup

### 🔧 Código JavaScript (Comentado en index.html)

Los siguientes archivos están **comentados** en `index.html` (líneas 295-301) y no se cargan en la aplicación:

1. **`constants.js`** 
   - Ubicación original: `js/config/constants.js`
   - Estado: Comentado en HTML - Arquitectura modular opcional

2. **`validators.js`**
   - Ubicación original: `js/utils/validators.js`
   - Estado: Comentado en HTML - Arquitectura modular opcional

3. **`mathUtils.js`**
   - Ubicación original: `js/utils/mathUtils.js`
   - Estado: Comentado en HTML - Arquitectura modular opcional

4. **`LugarService.js`**
   - Ubicación original: `js/services/LugarService.js`
   - Estado: Comentado en HTML - Arquitectura modular opcional

5. **`EstadisticasService.js`**
   - Ubicación original: `js/services/EstadisticasService.js`
   - Estado: Comentado en HTML - Arquitectura modular opcional

### 📁 Archivos Adicionales

6. **`lugares_data.js`** (si existe)
   - Ubicación original: `js/data/lugares.js`
   - Estado: Versión alternativa no utilizada (se usa `js/lugares.js`)

### 📄 Documentación Temporal/Obsoleta

7. **`GITHUB_PUSH.md`**
   - Estado: Guía temporal ya completada

8. **`MEJORAS_SENIOR.md`**
   - Estado: Documentación de mejoras (info ya integrada en README.md)

9. **`RESUMEN_MEJORAS.md`**
   - Estado: Resumen de mejoras (info ya integrada en README.md)

10. **`promt_modulo3.txt`**
    - Estado: Prompt del Módulo 3 (obsoleto, ahora es Módulo 4)

---

## ✅ Archivos que SÍ están en Uso (NO incluidos en backup)

Estos archivos están **activamente referenciados** en `index.html` y **NO** están en backup:

- ✅ `js/weatherService.js` (línea 275)
- ✅ `js/theme.js` (línea 278)
- ✅ `js/navigation.js` (línea 281)
- ✅ `js/utils/excursionista.js` (línea 284)
- ✅ `js/lugares.js` (línea 289)
- ✅ `js/app.js` (línea 304)

---

## 📅 Fecha del Backup

- **Fecha**: $(Get-Date -Format "dd/MM/yyyy HH:mm")
- **Motivo**: Respaldo de archivos no utilizados sin eliminar los originales

---

## 🔄 Restaurar desde Backup

Si necesitas restaurar algún archivo desde este backup:

```bash
# Ejemplo: Restaurar constants.js
Copy-Item backup\constants.js js\config\constants.js -Force
```

---

## 🗑️ Eliminar Backup

Si quieres eliminar esta carpeta de backup completamente:

```bash
Remove-Item backup -Recurse -Force
```

**Nota**: Esto NO afectará los archivos originales del proyecto.


