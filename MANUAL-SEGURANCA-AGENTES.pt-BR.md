# Manual — Segurança e trabalho supervisionado dos agentes

**Habblaud AI Community** — Walney Moreira Klein · walneyk@hotmail.com. Fork independente do Habblaud original (MIT).

## 1. O que existe hoje

O Marketplace permite cadastrar agentes, skills e pastas para leitura controlada. Pode ler arquivos de texto autorizados e enviar conteúdo para análise ou proposta de alteração por IA, após confirmação. **Não grava alterações no disco nem executa comandos por esse fluxo.** A extensão VS Code também não grava alterações automaticamente.

## 2. Por que a permissão precisa ser explícita

Um modelo pode errar, receber instruções maliciosas em arquivos de código ou propor uma alteração inadequada. Por isso, **instruções de uma skill não são permissões**. O servidor precisa verificar as autorizações independentemente do texto produzido pelo modelo.

## 3. Melhorias já implementadas nesta etapa

No Marketplace, mudar a pasta ou o arquivo selecionado invalida a leitura anterior e a proposta mostrada. A análise e a comparação exigem que o arquivo lido ainda corresponda à seleção atual. Isso evita usar acidentalmente o conteúdo de outro arquivo após trocar o seletor. Essa verificação de interface **não substitui** validação de segurança no servidor.

## 4. Modelo de autorização recomendado

1. Usuário cadastra uma pasta específica e escolhe leitura ou edição.
2. Agente recebe uma tarefa e solicita uma ferramenta específica.
3. Servidor valida pasta real, arquivo, extensão, tamanho, symlinks/junctions, segredo e escopo.
4. Agente produz uma proposta de patch com conteúdo e versão original do arquivo.
5. Interface mostra diff confiável, riscos e lista exata dos arquivos.
6. Usuário aprova **a operação concreta**, não uma permissão geral irrestrita.
7. Executor confirma que o arquivo não mudou, cria backup e aplica o patch atomicamente.
8. Testes permitidos são executados com timeout e limites; saída é registrada.
9. Usuário pode desfazer e consultar o log de auditoria.

## 5. Regras de segurança para uma futura implementação

- Negar escrita por padrão; permitir somente pastas e extensões explicitamente autorizadas.
- Não expor `.env`, tokens, certificados, chaves, credenciais e diretórios privados.
- Evitar execução de shell arbitrário. Começar com comandos de teste previamente cadastrados.
- Bloquear caminhos fora da pasta, inclusive por junctions e symlinks.
- Proteger APIs locais contra requisições originadas de sites não autorizados.
- Usar hashes ou versões para detectar mudanças concorrentes antes de gravar.
- Registrar agente, usuário, hora, ferramenta, arquivo, aprovação, resultado e backup.
- Nunca tratar respostas do modelo como código seguro ou instrução privilegiada.

## 6. Teste de segurança manual

1. Cadastre uma pasta de projeto de testes sem dados confidenciais.
2. Leia um arquivo A e solicite análise.
3. Troque para o arquivo B **sem ler**: a interface deve exigir nova leitura.
4. Troque de pasta: a prévia anterior não deve ser reutilizada.
5. Gere uma proposta, depois mude de arquivo: a comparação deve ser bloqueada até nova leitura.
6. Confira que nenhum arquivo local foi modificado.
7. Teste arquivos ocultos e nomes sensíveis: o servidor deve recusar.

## 7. Próximos módulos

**Etapa A:** diff real, backups, aplicação de alterações aprovadas no VS Code. **Etapa B:** executor de testes com allowlist e isolamento. **Etapa C:** histórico de ações, papéis e permissões por agente. **Etapa D:** ferramentas MCP supervisionadas. Cada etapa precisa de testes automatizados e revisão de segurança antes de ser disponibilizada ao público.
