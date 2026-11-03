# Manual — Edição supervisionada no VS Code (v0.2.0)

Créditos: Walney Moreira Klein — walneyk@hotmail.com

## O que foi implementado
A extensão Habblaud AI Community oferece o comando **Habblaud: Propor edição supervisionada**. Ele solicita ao agente o conteúdo atualizado de um arquivo, abre o comparador nativo do VS Code, pede autorização, verifica se o arquivo mudou e cria backup antes de aplicar a proposta no editor.

## Instalação
Execute o instalador de extensão do projeto (INSTALAR-EXTENSAO-VSCODE.ps1) ou copie integrations/vscode para a pasta de extensões do VS Code com o nome da extensão. Reinicie a janela do VS Code. Inicie o servidor Habblaud e cadastre ao menos um agente com provedor configurado.

## Como usar
1. Abra uma pasta confiável e um arquivo local de código com até 5.000 caracteres.
2. Salve o arquivo antes de começar.
3. Abra a paleta Ctrl+Shift+P e procure **Habblaud: Propor edição supervisionada**.
4. Escolha o agente e descreva a alteração.
5. Autorize explicitamente o envio do arquivo ao provedor escolhido.
6. Aguarde a proposta e examine o diff lado a lado.
7. Confirme **Aplicar proposta** somente se concordar.
8. A mudança aparecerá no editor ainda não salva: Ctrl+S para salvar ou Ctrl+Z para desfazer.

## Proteções
- Somente arquivos locais e workspaces confiáveis.
- Confirmação antes do envio e antes da aplicação.
- Bloqueio básico de nomes de arquivos potencialmente confidenciais.
- Verificação da versão do documento e hash do conteúdo em disco antes da edição.
- Backup em globalStorage da extensão, com metadados e hash SHA-256.
- Nenhuma execução automática de comandos.
- Nenhum salvamento automático após aplicar.

## Limitações importantes
- É uma primeira versão supervisionada, ainda não testada de ponta a ponta no VS Code.
- Não cria projetos inteiros nem modifica vários arquivos de uma vez.
- O filtro de segredos por nome não identifica todos os segredos dentro de arquivos comuns.
- A IA pode devolver conteúdo incorreto ou não preservar formatação.
- Arquivos com codificação diferente de UTF-8 ou alterações externas durante a operação podem exigir revisão.
- Não há botão dedicado de restauração de backups; o arquivo de backup pode ser recuperado manualmente.
- Não use em arquivos críticos sem Git e cópia de segurança adicional.

## Teste manual recomendado
1. Crie uma pasta de testes e um arquivo JavaScript pequeno.
2. Solicite uma alteração simples e rejeite a proposta; confirme que nada mudou.
3. Solicite novamente e aceite; confira diff e arquivo marcado como não salvo.
4. Use Ctrl+Z e confira a reversão.
5. Durante a geração, altere o arquivo em outro editor; a aplicação deve ser recusada.
6. Tente um arquivo .env; o comando deve recusar.
7. Confira os backups no diretório de armazenamento global da extensão.

## Próximas etapas
Testes automatizados com VS Code Extension Host, recuperação visual de backups, diff por seleção, múltiplos arquivos, revisão de segredos pelo conteúdo, logs e comandos de teste explicitamente autorizados.
