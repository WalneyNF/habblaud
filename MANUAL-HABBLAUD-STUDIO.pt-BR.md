# Manual Habblaud Studio v0.1 — Editor Monaco

Créditos: Walney Moreira Klein — walneyk@hotmail.com

## Objetivo
Editar código no navegador, sem precisar abrir o VS Code para inspecionar e preparar mudanças simples. Esta primeira versão é deliberadamente não destrutiva: abre arquivos autorizados em modo leitura e permite editar um rascunho em memória e baixá-lo.

## Instalação e acesso
1. Na pasta do projeto, execute npm install (a dependência monaco-editor está no package.json).
2. Inicie o Habblaud normalmente com npm run dev ou npm start após build.
3. Acesse http://127.0.0.1:4747/habblaud-studio (ajuste a porta se configurada).
4. Abra /agent-market e cadastre uma pasta de projeto, caso ainda não exista.
5. Volte ao Studio, selecione a pasta e clique Atualizar arquivos.

## Como utilizar
1. Clique em um arquivo na lista à esquerda.
2. Edite seu conteúdo com realce de sintaxe e recursos básicos do Monaco.
3. Clique Baixar versão editada para exportar uma cópia pelo navegador.
4. O arquivo original permanece intacto. Use Reverter rascunho para voltar ao conteúdo carregado.
5. Antes de trocar de arquivo, uma confirmação protege rascunhos não exportados.

## O que está pronto
- Monaco Editor servido localmente como dependência npm, sem CDN externa.
- Abas conceituais substituídas por seletor de arquivo, editor único.
- Lista de arquivos na raiz dos workspaces cadastrados no Marketplace.
- Leitura usando endpoint de inspeção já existente, com restrições de tipos e caminhos.
- Edição em memória, exportação e aviso de alterações não exportadas.
- Acesso ao Studio restrito a conexões locais.

## Limitações
- Não grava arquivos no workspace, não cria pastas, não navega subpastas e não oferece abas múltiplas.
- Não há agentes atuando dentro do editor nesta versão, nem diff, terminal, testes ou preview.
- A edição de arquivo com conteúdo confidencial não deve ser enviada a provedores externos.
- A lista mostra até 100 itens da raiz; a leitura bloqueia arquivos acima de 100 KB e pode truncar textos longos.
- O Monaco não equivale ao VS Code completo.

## Testes manuais
1. Abra /habblaud-studio e verifique se o editor carrega.
2. Cadastre uma pasta de teste no Marketplace e abra um arquivo JavaScript.
3. Modifique uma linha e confirme o aviso de rascunho.
4. Baixe o arquivo e compare com o conteúdo exportado.
5. Confira que o arquivo original no disco não foi modificado.
6. Teste Reverter rascunho.
7. Tente abrir arquivo confidencial e verifique que a API bloqueia a leitura.

## Próxima versão
Salvar com aprovação, diff, hash e backup, suporte a subpastas e abas, integração com agentes e pré-visualização segura.

## Nota de segurança
Não exponha o servidor local diretamente à internet. O navegador pode baixar o rascunho, mas nenhuma ferramenta executa automaticamente o conteúdo gerado.
