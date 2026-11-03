# Manual do desenvolvedor — Habblaud AI Community

**Adaptação:** Walney Moreira Klein — walneyk@hotmail.com  
**Projeto original:** [marmottajr/habblaud](https://github.com/marmottajr/habblaud) (MIT)  
**Fork:** [WalneyNF/habblaud](https://github.com/WalneyNF/habblaud)

> Este manual explica como usar a edição comunitária e como publicar versões novas, passo a passo, sem pressupor experiência com Git.

## 1. Entenda os nomes

- **Repositório:** pasta de arquivos e histórico do projeto no GitHub.
- **Fork:** sua cópia independente do projeto original.
- **Branch:** linha de desenvolvimento. `main` é normalmente a versão principal; `feature/ollama-groq` é a branch de melhorias em IA.
- **Commit:** ponto salvo no histórico, com uma descrição.
- **Push:** envia commits do seu computador para seu GitHub.
- **Pull Request (PR):** pedido para juntar mudanças de uma branch a outra.
- **Merge:** incorpora as mudanças à branch de destino.
- **Origin:** endereço do seu fork, `WalneyNF/habblaud`.
- **Upstream:** endereço do projeto original, `marmottajr/habblaud`.
- **README.md:** apresentação exibida na página principal do repositório.
- **.env:** arquivo local com configurações privadas; nunca publique suas chaves.

## 2. Onde estão os arquivos

No computador de desenvolvimento: `D:\xampp2\htdocs\habblaud`.

| Arquivo | Para que serve |
| --- | --- |
| `README.md` | Apresentação principal do fork, em português |
| `README-COMMUNITY.pt-BR.md` | Documentação técnica da adaptação |
| `community/ia-lab.html` | Cadastro e conversa com provedores |
| `community/manual-ia.html` | Manual HTML de provedores |
| `server/local-ai.ts` | Backend que conversa com as APIs |
| `.env.example` | Exemplo de variáveis privadas, sem chaves |
| `.env` | Suas chaves reais, somente no computador |
| `.habblaud-local/ai-providers.json` | Cadastro de provedores, sem chaves |
| `LICENSE` | Licença e atribuições que devem ser preservadas |

## 3. Iniciar o projeto

Abra CMD e execute:

```bat
cd /d D:\xampp2\htdocs\habblaud
npm install
npm run typecheck
npm run build
npm run start:ai
```

Depois abra `http://127.0.0.1:4747/`, `http://127.0.0.1:4747/ia-lab` e `http://127.0.0.1:4747/manual-ia`.

Se já houver outro servidor usando 4747, coloque `HABBLAUD_PORT=4750` no `.env` e reinicie.

## 4. Ollama local — passo a passo

1. Instale Ollama em https://ollama.com/download.
2. Confirme que o Ollama está rodando. Se não estiver, abra outro terminal e execute `ollama serve`.
3. Baixe um modelo com `ollama pull qwen2.5-coder:3b`.
4. Verifique os modelos: `ollama list`.
5. Teste: `ollama run qwen2.5-coder:3b`.
6. Abra `http://127.0.0.1:11434/api/tags` e veja se o modelo aparece.
7. Inicie o Habblaud, abra `/ia-lab`, escolha Ollama e confirme o modelo exato.
8. Clique em **Salvar configuração** e envie uma tarefa.

**Observação:** Ollama local normalmente não requer API key, mas usa memória, processamento e espaço em disco. O Habblaud não baixa modelos automaticamente.

## 5. Groq — passo a passo

1. Acesse https://console.groq.com/ e crie uma conta.
2. Gere uma API key e guarde-a em local seguro.
3. No diretório do projeto, copie `.env.example` para `.env`, se ainda não existir.
4. Abra o `.env` e escreva `GROQ_API_KEY=SUA_CHAVE`.
5. Reinicie o Habblaud com `npm run start:ai`.
6. Abra `/ia-lab` e selecione **Groq**.
7. Confira o endpoint `https://api.groq.com/openai/v1`.
8. Informe o identificador de um modelo disponível na sua conta Groq e salve.
9. Envie uma pergunta e confira a resposta.

**Erros comuns:** 401 (chave/autorização), 404 (modelo/endpoint), 429 (limite de uso). O Groq pode oferecer cota gratuita, mas limites e modelos podem mudar.

## 6. OpenAI, Gemini, OpenRouter e outros

No `.env`, use a variável do serviço desejado:

```dotenv
OPENAI_API_KEY=SUA_CHAVE
GEMINI_API_KEY=SUA_CHAVE
OPENROUTER_API_KEY=SUA_CHAVE
```

No laboratório, cadastre a URL base e o nome exato do modelo:

| Serviço | URL base | Variável |
| --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | `OPENAI_API_KEY` |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` | `GEMINI_API_KEY` |
| OpenRouter | `https://openrouter.ai/api/v1` | `OPENROUTER_API_KEY` |

**Importante:** ChatGPT Plus não equivale a créditos da API OpenAI. Consulte preços, cotas e modelos nos sites oficiais. O OpenCode CLI precisa de integração própria ou ponte de API compatível; apenas cadastrar o nome não instala nem executa o CLI.

## 7. Segurança das chaves

- O `.env` deve ficar **somente na sua máquina**. Ele é ignorado pelo Git, mas não é criptografado.
- O cadastro de provedores grava URL, modelo e nome da variável; **não grava a chave**.
- O servidor transmite a chave ao endpoint escolhido. **Não cadastre URLs desconhecidas**: um endpoint malicioso pode receber chave e mensagens.
- Serviços externos recebem o conteúdo enviado e aplicam suas políticas de privacidade.
- Não coloque senhas nem dados confidenciais nos prompts.
- Não exponha o servidor local à internet sem uma revisão de segurança.

## 8. Como criar uma nova versão

### 8.1 Verifique em qual branch está

```bat
cd /d D:\xampp2\htdocs\habblaud
git branch --show-current
git status
```

Se o Git mostrar **dubious ownership** nessa pasta, utilize `git -c safe.directory=D:/xampp2/htdocs/habblaud` no lugar de `git` em cada comando, ou peça ajuda para configurar a pasta com segurança.

### 8.2 Crie uma branch para a próxima melhoria

Exemplo de nome:

```bat
git switch main
git switch -c feature/instalador-windows
```

**Atenção:** faça isso somente quando sua `main` local estiver sincronizada com a versão principal desejada e não houver alterações não salvas. Se ainda estiver trabalhando em `feature/ollama-groq`, você pode criar a nova branch a partir dela, mas herdará suas mudanças.

### 8.3 Modifique os arquivos e teste

```bat
npm run typecheck
npm run build
npm test
```

Se um teste falhar, investigue antes de publicar. `npm run build` não garante que todos os recursos funcionam.

### 8.4 Salve as mudanças em um commit

```bat
git status
git add .
git commit -m "feat: instalador guiado para Windows"
```

**Antes de `git add .`:** confira se não existem senhas, backups privados ou arquivos pessoais. Nunca force o envio do `.env`.

### 8.5 Envie para seu GitHub

```bat
git push -u origin feature/instalador-windows
```

Se pedir autenticação, siga o fluxo seguro de login do Git/GitHub. Não cole tokens no chat nem nos comandos.

### 8.6 Transforme a versão em principal

1. Abra seu fork em https://github.com/WalneyNF/habblaud.
2. Clique em **Compare & pull request** ou abra **Pull requests → New pull request**.
3. Confirme **base: main** do seu fork e **compare: sua branch**.
4. Revise os arquivos alterados e os testes.
5. Clique em **Create pull request**.
6. Quando estiver seguro, clique em **Merge pull request** e **Confirm merge**.

Isso atualiza a `main` e, portanto, o `README.md` principal. **O merge também publica todo o código da branch**, não apenas o README.

### 8.7 Atualize seu computador após o merge

```bat
git switch main
git pull origin main
```

Não execute esses comandos se houver alterações locais pendentes; primeiro salve ou revise o trabalho.

## 9. Como lançar versões numeradas

Para indicar uma versão estável, use tags depois de testar e incorporar as mudanças à `main`:

```bat
git switch main
git pull origin main
git tag -a community-v0.2.0 -m "Habblaud AI Community 0.2.0"
git push origin community-v0.2.0
```

No GitHub, abra **Releases → Draft a new release**, escolha a tag, escreva as novidades e publique. Evite usar o mesmo número de versão do projeto original se isso causar confusão.

## 10. Como aproveitar novidades do criador original

O repositório original está configurado como `upstream`. Para verificar novas versões:

```bat
git fetch upstream
git log --oneline main..upstream/main
```

**Não faça merge automático do upstream sem revisar.** Ele pode alterar arquivos que seu fork também modificou, causar conflitos ou quebrar a integração. Faça uma branch de teste, compare as mudanças e execute a suíte completa.

Você pode seguir seu próprio roteiro. A licença MIT permite modificar e redistribuir o código, desde que preserve os avisos e condições da licença. Não precisa submeter suas funcionalidades ao autor original.

## 11. Glossário de comandos

| Comando | O que faz |
| --- | --- |
| `git status` | Mostra arquivos alterados |
| `git branch --show-current` | Mostra a branch atual |
| `git switch main` | Muda para a branch principal |
| `git switch -c feature/nome` | Cria uma branch e entra nela |
| `git add .` | Prepara mudanças para o commit |
| `git commit -m "mensagem"` | Salva uma etapa no histórico |
| `git push` | Envia commits ao GitHub |
| `git pull origin main` | Atualiza a `main` local a partir do fork |
| `git fetch upstream` | Consulta alterações do projeto original |
| `npm install` | Instala dependências |
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm run build` | Compila o projeto |
| `npm test` | Executa testes automatizados |
| `npm run start:ai` | Inicia com variáveis do `.env` |

## 12. Próximas melhorias recomendadas

1. **Assistente de instalação:** detectar Node, Ollama, modelos e porta disponível; orientar usuários iniciantes.
2. **Teste de conexão:** botão por provedor, com mensagens claras e sem expor chaves.
3. **Segurança:** validação mais restrita dos endpoints e isolamento dos agentes.
4. **Gestão de modelos:** listar modelos locais, escolher padrão, mostrar disponibilidade.
5. **Agentes de programação:** acesso a arquivos e ferramentas somente após autorização explícita.
6. **Testes e distribuição:** suíte automatizada confiável, instalador Windows e releases versionadas.

O laboratório atual é conversacional; essas melhorias ainda não devem ser anunciadas como prontas.

---

**Créditos:** Walney Moreira Klein — walneyk@hotmail.com.  
**Projeto original:** marmottajr/habblaud — licença MIT. Preserve `LICENSE` e os créditos originais.
