# Extensão Habblaud AI Community para VS Code

Protótipo local, não publicado no Marketplace oficial. Requer Habblaud iniciado e pelo menos um agente cadastrado em `/agent-market`.

## Instalação

Execute na raiz do projeto: `powershell -ExecutionPolicy Bypass -File .\INSTALAR-EXTENSAO-VSCODE.ps1`. Reinicie o VS Code.

Configure `habblaud.serverUrl` nas Configurações do VS Code com o endereço local do Habblaud, como `http://127.0.0.1:4747` ou `http://127.0.0.1:4755`.

## Uso

Selecione até 5.000 caracteres de código no editor. Clique com o botão direito e escolha **Habblaud: Analisar seleção com agente**. Selecione o agente, descreva a tarefa e confirme o envio. A análise aparece em um documento Markdown novo, ao lado do código.

## Segurança

A extensão aceita apenas HTTP loopback, exige seleção e confirmação, não grava arquivos e não executa comandos. Não selecione credenciais nem dados privados: se o agente usar um provedor externo, o código será enviado a ele. Ainda não há suporte a MCP, patches, diagnósticos em tempo real ou automação do editor.

Créditos: Walney Moreira Klein — walneyk@hotmail.com. Fork de marmottajr/habblaud (MIT).
