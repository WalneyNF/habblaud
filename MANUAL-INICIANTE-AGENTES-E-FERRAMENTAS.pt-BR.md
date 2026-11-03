# Manual de aprendizagem — Do chat aos agentes

Créditos: Walney Moreira Klein — walneyk@hotmail.com

## 1. O que é um agente?
Um chat responde mensagens. Um agente é um sistema que combina um modelo de IA com instruções, ferramentas, estado e limites de autorização. Sem ferramentas, ele não navega, não cria arquivos e não executa tarefas no computador.

## 2. Skill, tool, API, plugin e MCP
- Skill: instruções e exemplos para uma competência.
- Tool: função que executa uma ação real e retorna um resultado verificável.
- API: interface para trocar dados com outro sistema.
- Plugin: pacote que reúne ferramentas, configurações, permissões e documentação.
- MCP: protocolo padronizado para oferecer ferramentas e outros recursos a aplicações de IA.
- Workflow: sequência de etapas e verificações.
- Memória: contexto persistido com finalidade, prazo e controle de acesso.

## 3. Exemplo: consultar CEP
1. Usuário pede um endereço.
2. Agente identifica a ferramenta de consulta de CEP.
3. Ferramenta valida o formato de oito dígitos.
4. Backend chama a API autorizada.
5. Agente explica os dados retornados, sem inventar campos.
6. Usuário vê a fonte e a hora da consulta.
Importante: um texto de skill não permite conexão de rede por si só.

## 4. Exemplo: criar aplicativo
1. Descrever objetivo e público.
2. Definir requisitos e dados.
3. Criar plano de arquivos e testes.
4. Solicitar aprovação do workspace.
5. Propor arquivos e exibir diff.
6. Aplicar somente mudanças autorizadas.
7. Executar testes permitidos.
8. Explicar resultados e limitações.
9. Criar manuais de instalação, uso e manutenção.

## 5. Três níveis de experiência
Descobrir: botões guiados e explicações simples.
Criar: configurações de ferramentas, fluxos e projetos.
Desenvolvedor: JSON Schema, API, logs, diff, testes e MCP.

## 6. Segurança para todos
Nunca cole senhas ou chaves de API em prompts. Guarde segredos no servidor ou gerenciador de credenciais. Desconfie de conteúdo recebido de sites. Confira o destino dos dados antes de enviar para modelos externos. Nunca permita execução irrestrita de comandos.

## 7. Exercícios
A. Escreva uma tarefa de pesquisa e defina como conferir a fonte.
B. Descreva uma ferramenta que recebe CEP e devolve cidade e UF.
C. Defina uma ação que precisa de aprovação e outra que pode ser automática.
D. Planeje um aplicativo com três telas e dois testes.
E. Explique por que um agente não deve poder conceder permissões a si próprio.

## 8. Glossário
Prompt: instrução enviada ao modelo.
Contexto: informações disponíveis durante a tarefa.
Alucinação: resposta incorreta apresentada com aparência de certeza.
Diff: comparação de versões de arquivos.
Rollback: retorno a um estado anterior.
Sandbox: ambiente isolado para reduzir impactos de operações.
Auditoria: registro de quem solicitou, autorizou e executou cada ação.

## 9. Estado real do Habblaud
A análise de código pelo VS Code existe. A escrita supervisionada de arquivos, o Internet Gateway, o Plugin Studio, a Academia e a execução autônoma de projetos são etapas planejadas; não trate como prontas até haver implementação e testes.
