param([switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSScriptRoot
Set-Location $project
Write-Host 'HABBLAUD - DIAGNOSTICO EXPERIMENTAL' -ForegroundColor Cyan
Write-Host ('Projeto: ' + $project)
Write-Host 'Este script nao faz pull, push, merge, nem modifica arquivos de codigo.'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js nao encontrado.' }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'npm nao encontrado.' }
if (-not (Test-Path 'node_modules')) { throw 'Dependencias ausentes. Instale-as antes do teste.' }
Write-Host ('Node: ' + (node --version))
Write-Host ('npm: ' + (npm --version))
if (Get-Command git -ErrorAction SilentlyContinue) {
  git -c "safe.directory=$($project.Replace('\','/'))" status --short
  git -c "safe.directory=$($project.Replace('\','/'))" branch --show-current
}
$failures = @()
Write-Host '=== Vitest ===' -ForegroundColor Cyan
& npm exec -- vitest run server/agent-review.test.ts
if ($LASTEXITCODE -ne 0) { $failures += 'Vitest' }
Write-Host '=== Typecheck ===' -ForegroundColor Cyan
& npm run typecheck
if ($LASTEXITCODE -ne 0) { $failures += 'Typecheck' }
if (-not $SkipBuild) {
  Write-Host '=== Build ===' -ForegroundColor Cyan
  & npm run build
  if ($LASTEXITCODE -ne 0) { $failures += 'Build' }
}
if ($failures.Count -gt 0) { Write-Host ('FALHAS: ' + ($failures -join ', ')) -ForegroundColor Red; exit 1 }
Write-Host 'Verificacoes automatizadas passaram. Ainda e necessario testar a interface no navegador.' -ForegroundColor Green
exit 0
