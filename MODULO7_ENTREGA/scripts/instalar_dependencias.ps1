# ClimaTorre M7 - Instalar dependencias desde la raíz del repositorio
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $root
if (-not (Test-Path (Join-Path $root 'package.json'))) {
    Write-Error "No se encontró package.json en: $root"
}
Write-Host "Directorio del proyecto: $root" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "`nListo. Ejecuta: npm run dev" -ForegroundColor Green
