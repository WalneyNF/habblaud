$ErrorActionPreference='Stop'
$source=Join-Path $PSScriptRoot 'integrations\vscode'
$target=Join-Path $env:USERPROFILE '.vscode\extensions\walneynf.habblaud-ai-community-0.1.0'
if(!(Test-Path (Join-Path $source 'extension.js'))){throw 'Arquivos da extensão não encontrados.'}
if(Test-Path $target){Write-Host "Extensão já existe em $target. Feche o VS Code e remova a pasta para reinstalar.";exit 1}
New-Item -ItemType Directory -Force -Path $target | Out-Null
Copy-Item (Join-Path $source 'package.json') $target
Copy-Item (Join-Path $source 'extension.js') $target
Write-Host "Extensão instalada em $target"
Write-Host 'Reinicie o VS Code, selecione código, clique com o botão direito e escolha Habblaud: Analisar seleção com agente.'
Write-Host 'Configure habblaud.serverUrl se o servidor usar uma porta diferente de 4747.'
