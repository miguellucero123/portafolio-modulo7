# Genera PORTAFOLIO_M7_ENTREGA.zip en portafolio-m7/ excluyendo artefactos pesados.
# Ejecutar desde la raíz del repositorio: .\scripts\empaquetar-portafolio-m7.ps1

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$outDir = Join-Path $root 'portafolio-m7'
$zipName = 'PORTAFOLIO_M7_ENTREGA.zip'
$zipPath = Join-Path $outDir $zipName

$staging = Join-Path ([System.IO.Path]::GetTempPath()) ("portafolio-m7-staging-" + [Guid]::NewGuid().ToString('n'))

try {
    New-Item -ItemType Directory -Path $staging -Force | Out-Null

    $excludeDirs = @(
        'node_modules', 'dist', 'build', '.git', '.netlify', '.cursor',
        '.vscode', '.idea', 'portafolio-m7'
    )

    robocopy $root $staging /E /NFL /NDL /NJH /NJS /NC /NS /NP `
        /XD $excludeDirs | Out-Null
    $robocode = $LASTEXITCODE
    if ($robocode -ge 8) {
        throw "robocopy falló con código $robocode"
    }

    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }

    Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $zipPath -CompressionLevel Optimal -Force

    $sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    Write-Host "OK: $zipPath ($sizeMb MB)" -ForegroundColor Green
}
finally {
    if (Test-Path $staging) {
        Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
    }
}
