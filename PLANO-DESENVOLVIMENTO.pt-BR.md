# Plano de desenvolvimento — Habblaud AI Community

**Responsável pela adaptação:** Walney Moreira Klein — walneyk@hotmail.com  
**Base:** marmottajr/habblaud, MIT.

## Fase 1 — Instalação Windows e central de provedores

**Implementado nesta etapa:**
- Inicializadores `INSTALAR-WINDOWS.cmd`, `INICIAR-HABBLAUD.cmd` e `VERIFICAR-INSTALACAO.cmd`.
- Assistente PowerShell com diagnóstico de Node, npm, Git, Ollama e modelos.
- Instalação opcional de programas via winget, somente após confirmação.
- Preparação do `.env` sem substituir um arquivo existente.
- Instalação de dependências quando ausentes, verificação TypeScript e build.
- Central de provedores com cadastro, configuração de modelos, indicador de chave configurada e teste de conexão.
- Ollama: teste sem consumir tokens; verifica se o modelo selecionado está instalado.
- APIs externas: teste real com mensagem curta, após confirmação no navegador, podendo consumir cota.
- Manuais em português e instruções no README.

**Validação realizada:** diagnóstico Windows aprovado; execução do instalador sem interação concluída; typecheck e build concluídos; teste HTTP do Ollama aprovado; detecção de ausência de chave Groq aprovada.

**Ainda não validado:** instalação em Windows sem Node/Ollama, Groq com chave real, OpenAI/Gemini com chaves reais, todas as condições de falha, suíte completa de testes do projeto.

## Fase 2 — Segurança e confiabilidade (prioridade alta)

- Testes unitários de cadastro, validação, erros e limites.
- Restringir redirecionamentos HTTP e validar destino final para reduzir riscos de SSRF e vazamento de chave.
- Evitar expor mensagens internas de erro e dados de provedores ao cliente.
- Tratar concorrência, cancelamento, histórico e limites de uso.
- Validar instalações limpas em máquinas Windows distintas.
- Rever falhas pendentes da suíte do projeto original.

## Fase 3 — Experiência para iniciantes

- Assistente visual com interface gráfica e explicações contextualizadas.
- Descoberta automática dos modelos Ollama instalados.
- Escolha de modelo padrão, perfis e comparação de desempenho.
- Diagnóstico de espaço em disco, memória e porta ocupada.
- Distribuição assinada e versões numeradas com notas de lançamento.

## Fase 4 — Agentes produtivos

- Projetos e áreas de trabalho isoladas.
- Permissões explícitas para ler, escrever e executar.
- Pré-visualização de diffs e confirmação antes de aplicar alterações.
- Execução de testes, logs auditáveis e reversão.
- Integração específica com OpenCode CLI e outros executores.
- Orquestração multiagente com limites de custos.

## Critério para versão estável

Uma versão só deve ser anunciada como estável após instalação limpa reproduzível, suíte de testes aprovada ou falhas justificadas, revisão de segurança, documentação consistente e validação dos provedores anunciados como funcionais.
