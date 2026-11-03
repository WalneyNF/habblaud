# Governança do Habblaud

## Propósito
Construir uma comunidade técnica colaborativa, transparente e segura, preservando a direção do projeto e o reconhecimento dos autores.

## Autoria e licença
Este repositório deriva do Habblaud de Márcio Junior, distribuído sob licença MIT. O arquivo LICENSE original e os avisos aplicáveis devem ser preservados. Novas contribuições têm autoria própria. Coordenação da evolução comunitária: Walney Moreira Klein (walneyk@hotmail.com).

## Princípios
- Contribuições abertas por issues e pull requests; ninguém precisa de permissão de escrita para propor.
- Decisões técnicas justificadas por requisitos, testes, segurança e manutenção.
- Revisões respeitosas e rastreáveis; conflitos de interesse declarados.
- Mantenedores delegam revisão e triagem, não o controle da publicação oficial.
- Nenhuma credencial, dado privado ou arquivo de usuário deve ser exposto em PRs, logs ou relatórios.

## Papéis
- **Contribuidor:** propõe mudanças por fork e Pull Request.
- **Testador:** reproduz defeitos, valida funcionalidades e documenta resultados.
- **Triagem/QA:** organiza issues, reproduções e prioridades.
- **Mantenedor de área:** revisa código e recomenda aceitação conforme escopo autorizado.
- **Coordenador do projeto:** Walney Moreira Klein; decide prioridades e autoriza lançamentos oficiais.
- **Release manager:** prepara artefatos e evidências; só publica se tiver autorização explícita.

## Regras de integração
1. Toda alteração na `main` deve passar por Pull Request, salvo procedimento emergencial documentado.
2. Verificações CI (typecheck, testes e build) devem passar.
3. Mudanças de segurança, autenticação, permissões, acesso a arquivos e execução de comandos exigem revisão especializada.
4. Discussões de revisão devem ser resolvidas e o changelog atualizado quando aplicável.
5. A aprovação final de publicação oficial pertence a Walney Moreira Klein. Isso exige configuração técnica de proteção da branch, permissões e releases no GitHub; este documento não configura essas proteções.
6. O merge para a branch experimental não equivale a autorização de release.

## Tomada de decisão
- Correções pequenas: mantenedores revisam; integração conforme permissões vigentes.
- Funcionalidades maiores: issue de proposta, critérios de aceite, avaliação de segurança e plano de testes.
- Mudanças de arquitetura, licenciamento, governança ou direção do produto: decisão expressa do coordenador, registrada publicamente quando possível.
- Divergências: documentar alternativas e evidências; a coordenação arbitra quando não houver consenso.
- Substituição ou ampliação deste modelo requer proposta registrada e aprovação do coordenador.

## Transparência e sustentabilidade
Publicar roadmap, notas de versão, bugs conhecidos e critérios de aceitação. Reconhecer contribuições com autoria de commits e créditos de release. Delegar responsabilidades gradualmente para evitar gargalos.

## Limites deste documento
Esta é a política proposta do fork Habblaud. Não representa a governança do projeto upstream e não concede nem revoga permissões no GitHub.
