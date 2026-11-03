$ErrorActionPreference='Stop'
$source=Join-Path $PSScriptRoot 'integrations\vscode'
$target=Join-Path $env:USERPROFILE '.vscode\extensions\walneynf.habblaud-ai-community-0.1.0'
if(!(Test-Path (Join-Path $source 'extension.js'))){throw 'Arquivos da extensão não encontrados.'}
if(Test-Path $target){
 $manifest=Join-Path $target 'package.json'
 if(!(Test-Path $manifest) -or (Get-Content $manifest -Raw | ConvertFrom-Json).name -ne 'habblaud-ai-community-vscode'){throw 'A pasta de destino existe mas não pertence à extensão Habblaud. Instalação cancelada.'}
 Write-Host 'Atualizando a extensão Habblaud existente...'
}else{New-Item -ItemType Directory -Force -Path $target | Out-Null}
Copy-Item (Join-Path $source 'package.json') $target -Force
Copy-Item (Join-Path $source 'extension.js') $target -Force
Write-Host "Extensão instalada/atualizada em $target"
Write-Host 'Reinicie o VS Code. Use Ctrl+Shift+P e procure Habblaud: Analisar documento aberto com agente.'
Write-Host 'Configure habblaud.serverUrl caso a porta do servidor não seja 4747.'
