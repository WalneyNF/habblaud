<p align="center"><img src="client/public/assets/brand/logo-mark@4x.png" width="100" alt="Logotipo Habblaud"></p>

<h1 align="center">🏢 Habblaud AI Community</h1>

<p align="center"><strong>Seu escritório virtual de agentes de inteligência artificial — com Ollama local, Groq, OpenAI, Gemini e outros provedores.</strong></p>

<p align="center">Fork comunitário mantido por <strong>Walney Moreira Klein</strong> · <a href="mailto:walneyk@hotmail.com">walneyk@hotmail.com</a></p>

<p align="center"><a href="#-instalação-para-iniciantes">Começar agora</a> · <a href="#-ollama-ia-local-gratuita">Ollama local</a> · <a href="#-groq-api-na-nuvem">Groq</a> · <a href="#-openai-gemini-e-outros-provedores">Outros provedores</a> · <a href="#-segurança-e-privacidade">Segurança</a> · <a href="#-créditos-e-licença">Créditos</a></p>

> **Sobre este fork:** esta é uma adaptação independente do projeto original [marmottajr/habblaud](https://github.com/marmottajr/habblaud), sob licença MIT. O código e as imagens originais pertencem aos respectivos autores. A integração comunitária de IA, o cadastro de provedores e esta documentação são contribuições da adaptação. Não é uma versão oficial do autor original.

![Escritório virtual original do Habblaud](docs/screenshots/office.gif)

## ✨ O que é este projeto?

O Habblaud transforma a atividade dos agentes de IA em um **escritório virtual animado**. Em vez de acompanhar somente um terminal, você visualiza personagens, salas e atividades. A versão original acompanha principalmente Claude Code e Codex. **Este fork adiciona um laboratório de IA** para conectar modelos locais e serviços de API, mesmo que você não utilize Claude Code.

**Não precisa ser programador para experimentar:** siga as etapas abaixo, instale um modelo local ou configure uma chave de API e envie sua primeira pergunta. O cadastro de provedores funciona em uma página separada do escritório, acessível por **/ia-lab**.

### Imagens do Habblaud original

As imagens abaixo já fazem parte do repositório original e mostram recursos do escritório. **Não são capturas das novas telas de cadastro de IA.**

| Escritório | Detalhes do agente |
|---|---|
| ![Visão geral](docs/screenshots/overview.png) | ![Detalhes](docs/screenshots/agent-details.png) |

| Modo noturno | Versão para celular |
|---|---|
| ![Escritório à noite](docs/screenshots/night.png) | ![Visualização móvel](docs/screenshots/mobile.png) |

![Agentes colaborando no escritório original](docs/screenshots/collab.png)

## 🆕 O que mudou nesta edição?

| Recurso | Situação |
|---|---|
| Escritório virtual, animações e recursos originais | Preservados |
| Laboratório de IA em `/ia-lab` | Implementado |
| Cadastro de nome, URL, modelo e protocolo do provedor | Implementado |
| Configuração de Ollama local | **Testado com Qwen 2.5 Coder 3B** |
| Conversa real com modelo e indicação de atividade no escritório | **Testada com Ollama** |
| Groq, OpenAI, Gemini, OpenRouter e APIs compatíveis | Conectores implementados; requerem credenciais e testes individuais |
| Chaves via arquivo `.env` no servidor | Implementado |
| Manual HTML em `/manual-ia` | Implementado |
| Agentes capazes de editar arquivos e executar testes automaticamente | **Ainda não implementado nesta integração** |
| Instalação automática de Ollama, OpenCode ou modelos | **Ainda não implementada** |

> **Transparência:** cadastrar um provedor não significa instalar automaticamente seu aplicativo, CLI ou modelo. A integração atual é **conversacional**; ela não executa comandos nem modifica arquivos. Os modelos de provedores externos podem mudar de nome ou disponibilidade.

## 🚀 Instalação para iniciantes

### 1. Instale o que é necessário

No Windows, instale:
- [Node.js](https://nodejs.org/) **22.12 ou superior** (o Node inclui o npm).
- [Git](https://git-scm.com/downloads), para baixar o código.
- [Ollama](https://ollama.com/download), **somente se quiser IA local**.

Após instalar, abra o **Prompt de Comando (CMD)** e digite:

```bat
node --version
npm --version
git --version
```

Se aparecerem números de versão, está pronto. Se algum comando não for reconhecido, reinicie o terminal e verifique a instalação.

### 2. Baixe esta edição

No CMD:

```bat
cd /d D:\
git clone https://github.com/WalneyNF/habblaud.git
cd habblaud
npm install
```

**Importante:** se o fork ainda não tiver recebido a branch de desenvolvimento, a versão baixada do GitHub poderá ser a versão original. As novas funções precisam estar publicadas no repositório para aparecerem em outros computadores. Confira a seção [Estado da publicação](#-estado-da-publicação).

### 3. Prepare suas configurações privadas

Ainda dentro da pasta do Habblaud:

```bat
copy .env.example .env
notepad .env
```

O `.env.example` é apenas um exemplo, sem segredos. O `.env` é o seu arquivo privado. **Não envie o `.env` para o GitHub, Discord, WhatsApp ou outras pessoas.**

### 4. Inicie o programa

```bat
npm run build
npm run start:ai
```

Deixe o CMD aberto enquanto utiliza o Habblaud. No navegador, abra:

- **Escritório:** http://127.0.0.1:4747/
- **Cadastro e conversa com IA:** http://127.0.0.1:4747/ia-lab
- **Manual interativo:** http://127.0.0.1:4747/manual-ia

Se a porta 4747 estiver ocupada, coloque `HABBLAUD_PORT=4750` no `.env`, reinicie o servidor e substitua `4747` por `4750` nos endereços.

## 🦙 Ollama: IA local gratuita

O Ollama permite executar modelos no **seu computador**, sem enviar as perguntas a um serviço de IA na nuvem durante o uso local normal. Não exige chave de API para o servidor local padrão. Os modelos precisam ser baixados uma vez e exigem memória e espaço em disco.

### Passo 1 — Instale o Ollama

Acesse [ollama.com/download](https://ollama.com/download), instale a versão para seu sistema e inicie o aplicativo. Se necessário, em um CMD execute:

```bat
ollama serve
```

Se informar que a porta já está em uso, o Ollama provavelmente já está rodando; **não precisa iniciar uma segunda instância**.

### Passo 2 — Baixe um modelo

Para começar com um modelo de programação menor:

```bat
ollama pull qwen2.5-coder:3b
```

Para computadores com mais recursos, você pode experimentar:

```bat
ollama pull qwen2.5-coder:7b
```

Veja os modelos instalados:

```bat
ollama list
```

Teste a conversa no terminal:

```bat
ollama run qwen2.5-coder:3b
```

Digite uma pergunta. Para sair do modo interativo, use `/bye`.

### Passo 3 — Verifique a API local

Abra http://127.0.0.1:11434/api/tags no navegador. Deve aparecer um JSON com os modelos instalados. Se der erro de conexão, confira se o Ollama está em execução.

### Passo 4 — Use o modelo no Habblaud

1. Inicie o Habblaud com `npm run start:ai`.
2. Abra **http://127.0.0.1:4747/ia-lab**.
3. Selecione **Ollama local**.
4. No cadastro, confirme a URL `http://127.0.0.1:11434` e o modelo `qwen2.5-coder:3b` (ou o nome exato de `ollama list`).
5. Clique em **Salvar configuração** e envie uma pergunta.

**Pronto:** o backend envia a pergunta ao Ollama, recebe a resposta e registra a atividade do agente no escritório. Se o modelo for pesado para seu computador, tente um menor.

## ⚡ Groq: API na nuvem

O Groq executa modelos em seus servidores. **Não é o mesmo que Ollama local.** Pode oferecer uma modalidade gratuita com limites de uso, sujeitos a alterações. A disponibilidade de modelos e as cotas dependem da conta.

### Passo 1 — Crie uma conta e uma chave

Acesse [console.groq.com](https://console.groq.com/), crie uma conta, encontre a área de chaves de API e gere sua chave. Guarde-a em segurança.

### Passo 2 — Configure o arquivo privado

Abra `.env` e adicione:

```dotenv
GROQ_API_KEY=SUA_CHAVE_PRIVADA_AQUI
```

Salve o arquivo e **reinicie o Habblaud** com `npm run start:ai`.

### Passo 3 — Configure o provedor

Abra `/ia-lab`, selecione **Groq** e confira:
- **Protocolo:** API compatível com OpenAI.
- **URL base:** `https://api.groq.com/openai/v1`
- **Nome da variável da chave:** `GROQ_API_KEY`
- **Modelo:** informe o identificador de um modelo atualmente disponível na sua conta Groq.

Clique em **Salvar configuração**, escolha Groq no campo de conversa e envie uma pergunta. Se aparecer erro 401, revise a chave; 404 pode indicar modelo ou URL inválidos; 429 normalmente indica limite de uso.

**Atenção:** este fork já implementa o conector Groq, mas ainda não houve validação com uma chave real nesta etapa.

## 💳 OpenAI, Gemini e outros provedores

O procedimento é parecido: obtenha uma chave no serviço, coloque-a no `.env`, configure o endpoint e o identificador do modelo no laboratório e reinicie o servidor após alterar o `.env`.

| Serviço | URL base | Variável no `.env` |
|---|---|---|
| [OpenAI](https://platform.openai.com/) | `https://api.openai.com/v1` | `OPENAI_API_KEY` |
| [Google Gemini](https://aistudio.google.com/) | `https://generativelanguage.googleapis.com/v1beta/openai` | `GEMINI_API_KEY` |
| [Groq](https://console.groq.com/) | `https://api.groq.com/openai/v1` | `GROQ_API_KEY` |
| [OpenRouter](https://openrouter.ai/) | `https://openrouter.ai/api/v1` | `OPENROUTER_API_KEY` |
| Ollama local | `http://127.0.0.1:11434` | Nenhuma, normalmente |

Exemplo de `.env` (preencha **somente** os serviços que usar):

```dotenv
OPENAI_API_KEY=SUA_CHAVE_OPENAI
GEMINI_API_KEY=SUA_CHAVE_GEMINI
GROQ_API_KEY=SUA_CHAVE_GROQ
OPENROUTER_API_KEY=SUA_CHAVE_OPENROUTER
```

**OpenAI:** a assinatura do ChatGPT e a cobrança da API são produtos distintos; confira as condições e custos na plataforma de API. **Gemini:** consulte os modelos e cotas disponíveis no Google AI Studio. **OpenRouter:** modelos e preços variam conforme o provedor selecionado. Não presuma que todos são gratuitos.

### E o OpenCode?

O [OpenCode](https://opencode.ai/) é uma ferramenta de agentes de programação. **Não basta instalar o CLI e colocar o nome no cadastro.** Para usar o conector genérico desta edição, é necessário um servidor ou ponte que exponha a API Chat Completions compatível, com URL e modelo configurados. Uma integração direta com o OpenCode CLI é uma melhoria futura.

### Como adicionar outro provedor

No Laboratório, em **Configurações · Provedores**, preencha:
1. Um ID simples, por exemplo `minha-ia`.
2. Nome amigável.
3. Protocolo: **OpenAI compatível** ou **Ollama nativo**.
4. URL base HTTPS do provedor (ou HTTP local).
5. Nome exato do modelo.
6. Nome de uma variável de ambiente, como `MINHA_IA_API_KEY`.

Depois, coloque `MINHA_IA_API_KEY=SUA_CHAVE` no `.env`, reinicie o servidor e teste. **O cadastro não instala modelos nem garante compatibilidade com APIs que usam formatos diferentes.**

## 🔐 Segurança e privacidade

- **As chaves não são salvas no cadastro nem enviadas ao navegador.** O servidor lê as variáveis do `.env` e as utiliza para chamar o serviço escolhido.
- O `.env` é ignorado pelo Git, mas **não é criptografado no disco**. Proteja sua conta e seus arquivos.
- As configurações **sem chaves** são armazenadas em `.habblaud-local/ai-providers.json`, pasta ignorada pelo Git.
- **Nunca cadastre endpoints desconhecidos:** o endpoint recebe a chave correspondente e o conteúdo das perguntas.
- APIs externas recebem as mensagens e estão sujeitas às políticas de dados e cobrança do provedor.
- O histórico de conversa da extensão fica temporariamente em memória. Resumos de atividade podem aparecer no escritório e em registros locais.
- As novas rotas foram projetadas para aceitar apenas conexões do próprio computador. **Não publique o servidor diretamente na internet.**

## 🛠️ Problemas comuns

| Problema | O que verificar |
|---|---|
| `node` não reconhecido | Instale Node.js e abra um CMD novo |
| `ollama` não reconhecido | Instale Ollama e reinicie o terminal |
| Ollama não responde | Serviço ativo e porta 11434 |
| Modelo não encontrado | Nome exato retornado por `ollama list` |
| Provedor sem chave | Variável correta no `.env` e reinício do servidor |
| Erro 401 | Chave inválida ou sem autorização |
| Erro 404 | Modelo ou endpoint incompatível |
| Erro 429 | Cota ou limite de requisições |
| Porta 4747 ocupada | Defina `HABBLAUD_PORT=4750` |
| Escritório vazio | Desative o modo demonstração e envie uma tarefa no laboratório |

O manual HTML também está disponível em **/manual-ia**. Para detalhes adicionais, consulte [README-COMMUNITY.pt-BR.md](README-COMMUNITY.pt-BR.md). Para aprender a publicar novas versões, usar Git e atualizar seu fork, leia o [Manual do Desenvolvedor em português](MANUAL-DESENVOLVEDOR.pt-BR.md).

## 🗺️ Próximas melhorias

Estas são **metas, não recursos prontos**: integração direta do OpenCode CLI, gerenciamento de equipes de agentes, ferramentas de programação com autorização explícita, testes automatizados por provedor, interface integrada às configurações do escritório, streaming de respostas, armazenamento seguro de segredos pelo sistema operacional, instalador para iniciantes e documentação ilustrada com capturas das novas telas.

## 📦 Estado da publicação

O desenvolvimento e os testes desta extensão estão ocorrendo na branch local `feature/ollama-groq`. **Ter um fork no GitHub não publica automaticamente os commits locais.** Antes de recomendar o clone para outras pessoas, publique a branch, revise o diff e valide uma instalação limpa. O build e o typecheck da extensão passaram; a suíte completa do projeto ainda apresenta falhas que precisam ser investigadas.

## ❤️ Créditos e licença

**Fork e integração comunitária:** Walney Moreira Klein — [walneyk@hotmail.com](mailto:walneyk@hotmail.com) · [WalneyNF/habblaud](https://github.com/WalneyNF/habblaud).

**Projeto original:** [marmottajr/habblaud](https://github.com/marmottajr/habblaud), sob licença **MIT**. O Habblaud original, seus recursos visuais e as capturas de tela preservadas são creditados aos seus autores. Consulte o arquivo [LICENSE](LICENSE) e preserve os avisos de direitos autorais.

Este fork é independente e não é endossado oficialmente pelo mantenedor original. Contribuições, relatos de problemas e sugestões são bem-vindos por meio do repositório do fork.
