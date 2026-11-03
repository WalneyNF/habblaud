# Habblaud AI Community — Extensão local para VS Code

**Walney Moreira Klein — walneyk@hotmail.com**. Fork de marmottajr/habblaud (MIT).

## Instalar e atualizar

Com o servidor Habblaud iniciado, execute no PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\xampp2\htdocs\habblaud\INSTALAR-EXTENSAO-VSCODE.ps1"
```

Feche e reabra o VS Code. A instalação copia somente `package.json` e `extension.js` para a pasta de extensões local. Para atualizar, execute novamente o script e reinicie o editor.

## Configurar

No VS Code, procure `Habblaud: Server Url` nas configurações e informe `http://127.0.0.1:4747` (ou a porta em que seu servidor estiver funcionando). Cadastre um agente no Marketplace do Habblaud antes de usar.

## Como pedir ajuda

1. Abra um arquivo HTML, CSS, JavaScript, PHP, GDScript ou outra linguagem.
2. Selecione até 5.000 caracteres e clique com botão direito > **Habblaud: Analisar seleção com agente**.
3. Para analisar o documento aberto (até 6.000 caracteres), use Ctrl+Shift+P > **Habblaud: Analisar documento aberto com agente**.
4. Escolha o agente e uma tarefa: explicar, encontrar bugs, revisar segurança, desempenho, refatorar, criar testes ou pergunta personalizada.
5. Confirme o envio. A resposta aparece em uma aba Markdown ao lado.

## Segurança e limites

Somente servidores HTTP loopback são aceitos. O envio do código requer confirmação. Provedores externos recebem o código enviado; não selecione credenciais ou informações confidenciais. A extensão não altera arquivos, não executa terminal e não usa MCP. Ela não lê o projeto inteiro automaticamente.

Manual HTML detalhado: `D:\manuais\10-vscode-agentes-terminal.html`.
