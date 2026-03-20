# Repositorio GitHub dedicado al Módulo 7

La creación del repositorio en GitHub debe hacerse **desde la cuenta de GitHub** (interfaz web). Este proyecto no puede crear el repositorio remoto sin tus credenciales.

## 1. Crear el repositorio vacío en GitHub

1. Inicie sesión en [https://github.com](https://github.com).
2. Pulse **New** (o **New repository**).
3. Configure:
   - **Repository name:** por ejemplo `portafolio-modulo7` o `climatore-modulo7` (sin espacios; recomendado en minúsculas).
   - **Description:** opcional (p. ej. *ClimaTorre — Vue 3, Vue Router, Vuex — Módulo 7*).
   - **Public.**
   - **No** marque “Add a README”, **no** añada `.gitignore` ni licencia si ya tiene el proyecto en local (evita conflictos en el primer push).

4. Pulse **Create repository**.

GitHub mostrará una página con la URL del repositorio, por ejemplo:

`https://github.com/SU_USUARIO/portafolio-modulo7.git`

## 2. Enlazar el proyecto local y publicar

Abra una terminal en la **raíz del proyecto** (`modulo7_portafolio`) y ejecute **sustituyendo** la URL por la de su repositorio nuevo.

### Opción A — Publicar solo en el repo M7 (reemplaza `origin`)

Si ya no necesita el remoto anterior como principal:

```bash
git remote remove origin
git remote add origin https://github.com/SU_USUARIO/portafolio-modulo7.git
git push -u origin main
```

### Opción B — Mantener el remoto anterior y añadir el repo M7

Conserva `origin` (p. ej. `weather-frontend-m3`) y añade el M7 como segundo remoto:

```bash
git remote add m7 https://github.com/SU_USUARIO/portafolio-modulo7.git
git push -u m7 main
```

Tras el primer push, actualice el **README.md** del proyecto con la URL pública del nuevo repositorio (sección “Repositorio público”).

## 3. Comprobar

- Abra la URL `https://github.com/SU_USUARIO/portafolio-modulo7` y verifique que aparecen `src/`, `README.md`, `package.json`, etc.
- En **Settings → General**, puede ajustar descripción y visibilidad si hace falta.

## Autenticación

- **HTTPS:** GitHub suele pedir un **Personal Access Token** en lugar de la contraseña.
- **SSH:** si usa clave SSH, la URL del remoto debe ser del tipo `git@github.com:SU_USUARIO/portafolio-modulo7.git`.

---

**Nota:** Si el nombre del repositorio o el usuario difieren de los ejemplos, adapte las URLs en los comandos y en el README.
