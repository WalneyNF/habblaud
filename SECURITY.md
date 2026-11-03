# Política de segurança — Habblaud

## Como relatar vulnerabilidades
**Não publique detalhes de exploração, credenciais, tokens, chaves de API ou dados privados em issues públicas.** Prefira a funcionalidade **Report a vulnerability / Private vulnerability reporting** do GitHub, caso esteja habilitada no repositório. Se indisponível, contate o responsável pelo projeto por canal privado previamente confirmado.

Contato de coordenação: walneyk@hotmail.com. Evite enviar dados sensíveis em texto simples por email; solicite antes um canal seguro para compartilhar evidências.

## Escopo
Backend Node.js, interfaces web, integrações com IA, permissões de agentes, workspaces autorizados, execução de comandos, acesso a arquivos e distribuição de releases.

## Expectativas
- Envie resumo, impacto, versão, passos de reprodução e mitigação proposta por canal privado.
- Não explore contas ou computadores de terceiros.
- Não divulgue detalhes antes de coordenação responsável da correção.
- O projeto buscará confirmar recebimento, avaliar gravidade e comunicar atualizações; prazos de resposta não são garantidos.

## Segurança no desenvolvimento
- Nunca versionar `.env`, tokens, segredos, logs privados ou arquivos de usuários.
- Aplicar princípio do menor privilégio.
- Exigir aprovação humana para ações destrutivas e operações sensíveis de agentes.
- Validar caminhos de arquivo, tamanho de entrada, autorização e integridade das alterações.
- Testar atualizações e dependências antes de publicar.
