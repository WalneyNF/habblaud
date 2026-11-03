# Habblaud AI Community — Plano mestre da plataforma

Créditos: Walney Moreira Klein — walneyk@hotmail.com

## Visão
Escritório virtual onde iniciantes e especialistas aprendem, criam e supervisionam agentes de IA que executam tarefas reais.

## Princípios obrigatórios
1. Mostrar claramente quando algo é demonstração e quando uma ferramenta realmente executou uma ação.
2. Nunca conceder permissões a um agente por iniciativa do próprio modelo.
3. Aprovação humana antes de escrever arquivos, enviar dados confidenciais, executar comandos ou publicar conteúdos.
4. Manter histórico, erros, custos, provedores, fontes e resultados auditáveis.
5. Toda entrega inclui manual do usuário, manual técnico, exemplos, testes e limitações.
6. Interfaces progressivas: Descobrir, Criar e Desenvolvedor.
7. Preservar atribuição e licença do projeto original.

## Roadmap por entregas verificáveis
### M1 — VS Code supervisionado
- Selecionar agente e tarefa
- Propor alteração completa em arquivo
- Comparar no diff nativo do VS Code
- Exigir confirmação específica por arquivo
- Conferir versão/hash antes da aplicação
- Backup durável, restauração e log
- Testes de cancelamento, concorrência, arquivo modificado e dados confidenciais

### M2 — Registro de ferramentas e Internet Gateway
- Schema de tool: id, descrição, entradas JSON Schema, permissões, domínio e timeout
- Busca web via provedor configurado, leitor HTTP limitado a domínios permitidos
- Bloquear localhost, IPs privados, metadados de nuvem, redirecionamentos indevidos e URLs perigosas
- Credenciais somente no backend, nunca em prompts, páginas ou logs
- Evidências, links e data de consulta em cada relatório
- Testes com respostas maliciosas e prompt injection

### M3 — API Studio e Plugin Studio
- Criador visual de conectores HTTP, autenticação segura e testes com dados simulados
- Plugins versionados e assinados ou aprovados pelo administrador
- Permissões declarativas por ferramenta; importação desabilitada por padrão
- Exemplos: CEP, clima, repositórios Git, arquivos CSV e PDFs

### M4 — Agent Team Builder e Software Factory
- Gerente, analista, arquiteto, desenvolvedores, QA e documentador
- Tarefas com estados, dependências, critérios de aceite e resultados
- Geração de projetos em workspace autorizado, nunca fora dele
- Execução de testes via comandos explicitamente autorizados
- Demonstração: Controle de Pagamentos Node.js + SQLite

### M5 — Academia e Missões
- Modo Descobrir, Criar e Desenvolvedor
- Missões: primeiro prompt, primeira ferramenta, primeira API, primeira equipe, primeiro aplicativo
- Glossário, exercícios, respostas verificáveis, simulador sem efeitos colaterais
- Acessibilidade, teclado, contraste e linguagem simples

### M6 — Automação, Conhecimento e Comunidade
- Agendamentos com consentimento e cancelamento
- Documentos pessoais com escopo, citação e exclusão controlada
- Galeria de templates, skills e plugins com revisão de segurança
- Importação/exportação de projetos sem segredos

## Critério de conclusão de cada módulo
- Funcionalidade real demonstrada e reproduzível
- Testes automatizados e verificação manual documentada
- Manual do usuário e manual do desenvolvedor em português
- Exemplos executáveis, changelog e limitações explícitas
- Nenhum merge em main sem autorização do mantenedor

## Ordem recomendada
M1 -> M2 -> M3 -> M4 -> M5 -> M6. A experiência visual pode evoluir em paralelo, sem mascarar pendências técnicas.
