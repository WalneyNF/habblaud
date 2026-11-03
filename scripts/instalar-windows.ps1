# Habblaud AI Community - Instalador assistido para Windows.
# Nao solicita chaves de API, nao altera PATH e nao executa winget sem confirmacao.
[CmdletBinding()]
param(
 [switch]$CheckOnly,
 [switch]$NonInteractive,
 [switch]$SkipBuild,
 [switch]$StartAfterInstall
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root
$issues = New-Object System.Collections.Generic.List[string]
function Info([string]$message) { Write-Host "[INFO] $message" -ForegroundColor Cyan }
function Good([string]$message) { Write-Host "[ OK ] $message" -ForegroundColor Green }
function Warn([string]$message) { Write-Host "[AVISO] $message" -ForegroundColor Yellow }
function Ask([string]$question) {
 if($NonInteractive -or $CheckOnly) { return $false }
 $answer = Read-Host "$question [s/N]"
 return $answer -match '^(s|sim|y|yes)$'
}
function Cmd([string]$name) { return Get-Command $name -ErrorAction SilentlyContinue }
function InstallWithWinget([string]$name,[string]$id) {
 if(-not (Cmd 'winget')) { Warn "winget indisponivel; instale $name manualmente."; return }
 if(Ask "Deseja instalar $name pelo winget?") {
   Info "Executando winget para $name..."
   & winget install --id $id --exact --accept-source-agreements --accept-package-agreements
   if($LASTEXITCODE -ne 0) { Warn "winget retornou codigo $LASTEXITCODE para $name" }
   Warn 'Se o comando continuar indisponivel, feche e abra o terminal.'
 }
}
Write-Host ''
Write-Host '=====================================================' -ForegroundColor Green
Write-Host '  HABBLAUD AI COMMUNITY - ASSISTENTE WINDOWS' -ForegroundColor Green
Write-Host '  Walney Moreira Klein - walneyk@hotmail.com'
Write-Host '=====================================================' -ForegroundColor Green
Info "Projeto: $root"
if($PSVersionTable.PSEdition -ne 'Desktop' -and $PSVersionTable.PSEdition -ne 'Core') { Warn 'PowerShell nao identificado.' }
if(-not (Cmd 'node')) { Warn 'Node.js nao encontrado.'; InstallWithWinget 'Node.js LTS' 'OpenJS.NodeJS.LTS' }
$nodeVersion = $null
if(Cmd 'node') {
 try { $nodeVersion = (& node --version).Trim(); $major = [int]($nodeVersion.TrimStart('v').Split('.')[0]); $minor = [int]($nodeVersion.TrimStart('v').Split('.')[1]); if($major -lt 22 -or ($major -eq 22 -and $minor -lt 12)) { $issues.Add("Node.js $nodeVersion e antigo. Requer >=22.12.") } else { Good "Node.js $nodeVersion" } }
 catch { $issues.Add('Nao foi possivel verificar Node.js.') }
} else { $issues.Add('Node.js ausente. Instale e abra novamente o instalador.') }
if(Cmd 'npm') { Good "npm $(& npm --version)" } else { $issues.Add('npm nao encontrado.') }
if(Cmd 'git') { Good "Git $(& git --version)" } else { Warn 'Git opcional para instalar a partir de ZIP; necessario para atualizar via Git.'; InstallWithWinget 'Git' 'Git.Git' }
if(Cmd 'ollama') {
 Good "Ollama $(& ollama --version 2>&1 | Select-Object -First 1)"
 try {
   $tags=Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 3
   $names=@($tags.models | ForEach-Object { $_.name })
   if($names.Count -gt 0) { Good ('Modelos Ollama: '+($names -join ', ')) }
   else { Warn 'Ollama ativo, mas nenhum modelo instalado.' }
 } catch { Warn 'Ollama instalado, mas a API local nao respondeu. Abra o aplicativo Ollama.' }
} else {
 Warn 'Ollama nao encontrado (opcional; voce tambem pode usar Groq/OpenAI/Gemini).'
 InstallWithWinget 'Ollama' 'Ollama.Ollama'
}
if(-not (Test-Path (Join-Path $root 'package.json'))) { $issues.Add('package.json ausente. Execute dentro da pasta correta do projeto.') }
if($CheckOnly) {
 if($issues.Count) { $issues | ForEach-Object { Warn $_ }; exit 2 }
 Good 'Diagnostico concluido. Nenhuma instalacao foi executada.'
 exit 0
}
if($issues.Count) { $issues | ForEach-Object { Warn $_ }; throw 'Corrija os requisitos e execute novamente.' }
$envPath=Join-Path $root '.env'
$example=Join-Path $root '.env.example'
if(-not (Test-Path $envPath)) {
 if(Test-Path $example) { Copy-Item -LiteralPath $example -Destination $envPath; Good 'Arquivo .env criado sem chaves.' }
 else { Warn '.env.example nao encontrado; crie .env manualmente se precisar de chaves.' }
} else { Good 'Arquivo .env existente preservado.' }
if(-not (Test-Path (Join-Path $root 'node_modules'))) {
 Info 'Instalando dependencias do projeto (npm ci)...'
 & npm ci --no-audit --no-fund
 if($LASTEXITCODE -ne 0) { throw "npm ci falhou: $LASTEXITCODE" }
} else { Good 'node_modules encontrado. Dependencias existentes preservadas.' }
if(-not $SkipBuild) {
 Info 'Verificando TypeScript...'
 & npm run typecheck
 if($LASTEXITCODE -ne 0) { throw 'Typecheck falhou.' }
 Info 'Compilando aplicativo...'
 & npm run build
 if($LASTEXITCODE -ne 0) { throw 'Build falhou.' }
} else { Warn 'Build ignorado por parametro.' }
$launcher=Join-Path $root 'INICIAR-HABBLAUD.cmd'
if(-not (Test-Path $launcher)) { Warn 'Atalho de inicializacao ausente.' } else { Good 'Inicializador INICIAR-HABBLAUD.cmd pronto.' }
Write-Host ''
Good 'Instalacao/verificacao concluida.'
Info 'Para iniciar: clique duas vezes em INICIAR-HABBLAUD.cmd'
Info 'Laboratorio: http://127.0.0.1:4747/ia-lab'
Info 'Manual: http://127.0.0.1:4747/manual-ia'
Info 'Para configurar chaves: edite .env e reinicie o servidor.'
if($StartAfterInstall -or (Ask 'Deseja iniciar o Habblaud agora?')) {
 & npm run start:ai
}
