# Marketplace de Agentes — Habblaud AI Community

Créditos: Walney Moreira Klein — walneyk@hotmail.com. Original: marmottajr/habblaud (MIT).

Abra http://127.0.0.1:4747/agent-market depois de iniciar o Habblaud.

## Como usar

1. Cadastre um agente com nome, função, personalidade e provedor de IA.
2. Crie skills com instruções e associe-as ao agente.
3. Cadastre uma pasta de projeto existente para leitura.
4. Selecione agente e pasta, liste arquivos e escolha um arquivo de texto.
5. Leia a prévia, escreva a tarefa e confirme o envio do conteúdo à IA.

## Segurança

A versão inicial é somente leitura, restrita ao computador local. Não executa comandos, não escreve arquivos nem executa MCP. Arquivos ocultos e alguns caminhos sensíveis são bloqueados. A leitura exige seleção de arquivo. O envio ao modelo exige confirmação; provedores externos recebem o conteúdo e podem cobrar por uso. Não autorize pastas com segredos ou dados de clientes.

## Propor correções sem modificar o disco

Depois de pré-visualizar um arquivo, clique em **Propor código corrigido (sem salvar)**. O modelo responderá com uma versão sugerida do arquivo. Clique em **Comparar com o arquivo original** para visualizar linhas diferentes. A comparação atual é simplificada, podendo ser imprecisa quando há inserção ou remoção de linhas. Revise a proposta manualmente: nenhum arquivo será alterado pelo Marketplace.

## Próximos passos

Criar ferramentas de proposta de alterações, aprovação de diffs, backup, reversão, logs, execução isolada de testes e cliente MCP real. Essas capacidades ainda não estão implementadas.

Versão HTML deste manual: D:\manuais\08-marketplace-agentes.html
