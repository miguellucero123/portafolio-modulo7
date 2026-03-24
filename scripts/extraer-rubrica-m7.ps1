# Genera RUBRICA_M7_CONTENIDO/entrega/ con solo lo necesario para la rúbrica M7 (sin legacy ni clones).
# Ejecutar desde la raíz del repositorio: .\scripts\extraer-rubrica-m7.ps1

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$dest = Join-Path $root 'RUBRICA_M7_CONTENIDO\entrega'

function Copy-Dir {
    param([string]$RelPath)
    $src = Join-Path $root $RelPath
    if (-not (Test-Path $src)) { throw "No existe: $src" }
    $target = Join-Path $dest $RelPath
    $parent = Split-Path $target -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Copy-Item -Path $src -Destination $target -Recurse -Force
}

function Copy-FileTo {
    param([string]$FromRel, [string]$ToRel)
    $src = Join-Path $root $FromRel
    if (-not (Test-Path $src)) { throw "No existe: $src" }
    $target = Join-Path $dest $ToRel
    $parent = Split-Path $target -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Copy-Item -Path $src -Destination $target -Force
}

if (Test-Path $dest) {
    Remove-Item $dest -Recurse -Force
}
New-Item -ItemType Directory -Path $dest -Force | Out-Null

Copy-Dir 'src'
Copy-Dir 'public'
Copy-FileTo 'index.html' 'index.html'
Copy-FileTo 'vite.config.js' 'vite.config.js'
Copy-FileTo 'package.json' 'package.json'
Copy-FileTo 'package-lock.json' 'package-lock.json'
Copy-FileTo 'netlify.toml' 'netlify.toml'
Copy-FileTo '.gitignore' '.gitignore'
Copy-FileTo 'README.md' 'README.md'
Copy-FileTo 'RUBRICA_CUMPLIMIENTO.md' 'RUBRICA_CUMPLIMIENTO.md'

Copy-Dir 'MODULO7_ENTREGA'
$opt05 = Join-Path $dest 'MODULO7_ENTREGA\05_OPCIONAL_MEJORAS_ENFOQUE_SENIOR.md'
if (Test-Path $opt05) { Remove-Item $opt05 -Force }

New-Item -ItemType Directory -Path (Join-Path $dest 'docs') -Force | Out-Null
Copy-FileTo 'docs\DEPLOY_NETLIFY.md' 'docs\DEPLOY_NETLIFY.md'
Copy-FileTo 'docs\GITHUB_SETUP_M7.md' 'docs\GITHUB_SETUP_M7.md'

New-Item -ItemType Directory -Path (Join-Path $dest 'scripts') -Force | Out-Null
Copy-FileTo 'scripts\empaquetar-portafolio-m7.ps1' 'scripts\empaquetar-portafolio-m7.ps1'
Copy-FileTo 'scripts\extraer-rubrica-m7.ps1' 'scripts\extraer-rubrica-m7.ps1'

New-Item -ItemType Directory -Path (Join-Path $dest 'RUBRICA_M7_CONTENIDO') -Force | Out-Null
Copy-FileTo 'RUBRICA_M7_CONTENIDO\README.md' 'RUBRICA_M7_CONTENIDO\README.md'
Copy-FileTo 'RUBRICA_M7_CONTENIDO\LISTADO_ARCHIVOS_RUBRICA_M7.md' 'RUBRICA_M7_CONTENIDO\LISTADO_ARCHIVOS_RUBRICA_M7.md'

Write-Host "Listo: $dest" -ForegroundColor Green
Write-Host "Verificar: cd RUBRICA_M7_CONTENIDO\entrega ; npm install ; npm run build" -ForegroundColor Cyan
