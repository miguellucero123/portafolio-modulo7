@echo off
chcp 65001 >nul
echo ============================================
echo  ClimaTorre - Instalar dependencias (M7)
echo ============================================
echo.
set "ROOT=%~dp0..\.."
cd /d "%ROOT%"
if not exist "package.json" (
  echo ERROR: No se encontró package.json en: %ROOT%
  echo Ejecuta este script desde MODULO7_ENTREGA\scripts\
  pause
  exit /b 1
)
echo Directorio del proyecto: %CD%
echo.
call npm install
if errorlevel 1 (
  echo Falló npm install.
  pause
  exit /b 1
)
echo.
echo Listo. Luego: npm run dev
pause
