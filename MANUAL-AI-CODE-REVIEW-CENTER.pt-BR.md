# Manual — Habblaud AI Code Review Center v0.1

**Autor:** Walney Moreira Klein — walneyk@hotmail.com
**Projeto:** Habblaud AI Community, branch feature/ollama-groq

## 1. Finalidade
O AI Code Review Center permite comparar alterações em um arquivo real com uma proposta editada no Monaco. O servidor confere a integridade do arquivo em disco usando SHA-256 antes de autorizar a comparação. A comparação é **local, determinística e não destrutiva**: não executa comandos nem grava alterações no disco. Opcionalmente, o usuário pode solicitar parecer de um agente, com confirmação explícita antes de enviar original e proposta ao provedor configurado.

## 2. Instalação
Na pasta D:\xampp2\htdocs\habblaud, execute npm install, npm run build e inicie o Habblaud com npm start. Se usar npm run dev, a nova rota também é registrada. Acesse http://127.0.0.1:4747/habblaud-studio (ou a porta configurada).

## 3. Preparar o workspace
Abra /agent-market, clique em Autorizar pasta e cadastre uma pasta de projeto existente com caminho absoluto. Não escolha diretórios de sistema. O acesso é restrito a arquivos de código e documentação permitidos, com checagem de caminho real e bloqueio de nomes sensíveis.

## 4. Revisar um arquivo
1. No Studio, selecione o workspace e clique no arquivo desejado.
2. Edite o código no Monaco. A edição permanece apenas na memória do navegador.
3. Clique em **Revisar alterações (diff)**.
4. O backend relê o arquivo real, verifica seu hash e devolve original e proposta.
5. O Monaco mostra duas colunas: esquerda é o original; direita é a proposta.
6. Revise linha a linha e clique em **Voltar ao editor**.
7. Opcional: selecione um agente no campo **Agente revisor**, clique em **Solicitar parecer da IA** e confirme o envio de ambos os conteúdos. O parecer aparece abaixo do editor; verifique as afirmações.
8. Se quiser exportar, clique em **Baixar versão editada**. O arquivo original não é sobrescrito.

## 5. Exemplo
Arquivo original:
```js
function soma(a, b) { return a + b; }
```
Proposta no editor:
```js
function soma(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new TypeError('Números esperados');
  return a + b;
}
```
O diff destaca as mudanças, mas **não afirma que a nova implementação é melhor**: alterar validações pode quebrar compatibilidade. O desenvolvedor precisa analisar regras de negócio e testes.

## 6. Segurança e limitações
- Restrito a clientes loopback; continua sujeito ao guard HTTP geral do projeto.
- Usa workspaces explicitamente cadastrados e validação de caminho canônico para impedir acesso fora da pasta.
- Rejeita hash obsoleto, proposta acima de 8.000 caracteres e arquivos truncados ou não UTF-8.
- Não modifica arquivos nem executa testes. Envio à IA é opcional e exige confirmação, podendo envolver provedores externos.
- O parecer por LLM é textual e não é verificado automaticamente. Comentários por linha, pontuação de segurança validada, integração Git e aprovação para gravar são etapas futuras.
- A contagem de linhas alteradas é **estimativa por posição**, não um algoritmo completo de diff. O diff visual real é fornecido pelo Monaco.
- O filtro de nomes de arquivos sensíveis não identifica segredos dentro de arquivos comuns. Não compartilhe conteúdo sem inspeção.
- Faça backup e mantenha seus projetos sob controle de versão.

## 7. Testes automatizados
Execute:
```powershell
npx vitest run server/agent-review.test.ts
npm run typecheck
npm run build
```
Os testes de API verificam hash SHA-256, rejeição de hash obsoleto, traversal de caminhos, limite de tamanho e preservação do arquivo original.

## 8. Roteiro manual de homologação
1. Abra o Studio no navegador e cadastre uma pasta de testes.
2. Abra um arquivo .js pequeno e altere uma linha.
3. Clique Revisar alterações e confirme o diff lado a lado.
4. Clique Voltar ao editor e confira que o rascunho permanece.
5. Exporte o arquivo e compare o download.
6. Altere o arquivo original no disco em outro editor e tente revisar novamente; a API deve recusar com mensagem de arquivo alterado.
7. Confirme que nenhuma operação alterou o arquivo original.
8. Tente um caminho com ../ e um arquivo .env via API; a requisição deve ser recusada.

## 9. Próximas versões
Comentários por linha, checklist de revisão, integração opcional com agentes para explicar alterações, análise estática, execução de testes supervisionada, backups e gravação mediante aprovação explícita, com prevenção de condições de corrida.
