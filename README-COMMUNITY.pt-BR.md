# Habblaud Community — Integração de provedores de IA

> Fork comunitário de [Habblaud](https://github.com/marmottajr/habblaud), criado por **marmottajr**. Projeto original sob licença MIT. Adaptação comunitária: **Walney Moreira Klein — walneyk@hotmail.com**.

## O que mudou nesta versão

Esta branch adiciona ao Habblaud v1.0.3 um **Laboratório de IA** com cadastro local de provedores e modelos, integração conversacional e eventos reais de atividade no escritório. A interface original, o sistema Claude Code e o Codex continuam preservados.

- Cadastro de até 40 configurações com nome, identificador, protocolo, URL base, modelo e nome da variável de ambiente.
- Modelos locais pelo Ollama.
- APIs compatíveis com o formato OpenAI: OpenAI, Google Gemini (endpoint compatível), Groq, OpenRouter e serviços próprios.
- OpenCode: **somente quando houver servidor/ponte com endpoint compatível**. A instalação do CLI OpenCode, isoladamente, não garante uma API compatível.
- Configurações **sem segredos** gravadas em `.habblaud-local/ai-providers.json` na pasta do projeto (ou `HABBLAUD_AI_DATA_DIR`).
- Chaves lidas pelo **servidor Node** a partir de variáveis de ambiente; nenhuma chave é cadastrada na interface nem retornada pela API.
- Histórico de conversa temporário em memória; ao reiniciar o servidor, o histórico desaparece.
- Acesso ao laboratório e suas rotas restrito ao computador local.

**Importante:** esta integração é um laboratório de **chat**, não um executor autônomo de código. Os agentes não alteram arquivos nem executam comandos. A compatibilidade com provedores depende do endpoint e do modelo; APIs com protocolos diferentes exigem adaptadores próprios. Serviços externos recebem o texto das mensagens enviadas e podem aplicar suas próprias políticas de retenção. Não existe garantia de sigilo absoluto fora do computador.

## Instalação (Windows)

Pré-requisitos: Node.js 22.12+, Git, npm e, para uso local, Ollama.

```bat
git clone https://github.com/WalneyNF/habblaud.git
cd habblaud
npm install
copy .env.example .env
notepad .env
npm run typecheck
npm run build
npm run start:ai
```

**Atenção:** as alterações precisam estar publicadas na branch do fork para aparecerem em um clone novo. Enquanto estiverem somente no computador do desenvolvedor, use a pasta de trabalho local.

Abra **http://127.0.0.1:4747/ia-lab** para cadastro e chat; **http://127.0.0.1:4747/manual-ia** para manual, e **http://127.0.0.1:4747/** para o escritório.

Se já houver um Habblaud usando a porta 4747, configure `HABBLAUD_PORT=4750` no `.env` antes de iniciar.

## Configurar provedores e chaves

1. Copie `.env.example` para `.env`.
2. Preencha somente as variáveis necessárias, por exemplo `OPENAI_API_KEY=SUA_CHAVE` ou `GEMINI_API_KEY=SUA_CHAVE`.
3. Inicie com `npm run start:ai`. O comando carrega o `.env` pelo Node.
4. No Laboratório, escolha um cadastro, edite **nome, endpoint, modelo e nome da variável de ambiente** e clique em **Salvar configuração**.
5. Reinicie o servidor quando modificar o `.env`; envie uma tarefa para testar.

O cadastro aceita HTTP apenas para localhost; para serviços externos, exige HTTPS. **Não insira sua chave na URL.** Nunca envie o `.env` ao GitHub; o arquivo está no `.gitignore`. O servidor mantém as chaves em memória e as transmite apenas ao endpoint configurado, por HTTPS para provedores externos. Confira cuidadosamente a URL cadastrada: um endpoint malicioso pode receber a chave e o conteúdo das mensagens.

O cadastro de um novo provedor **não instala automaticamente um SDK, CLI ou modelo**. Ele conecta uma API que já esteja disponível. Os modelos pré-preenchidos são exemplos e podem ser alterados conforme a disponibilidade do provedor.

## Protocolos suportados

| Provedor | Protocolo | Chave |
| --- | --- | --- |
| Ollama | API nativa `/api/chat` | Não exige por padrão |
| OpenAI | Chat Completions | `OPENAI_API_KEY` |
| Google Gemini | Endpoint compatível com OpenAI | `GEMINI_API_KEY` |
| Groq | Chat Completions | `GROQ_API_KEY` |
| OpenRouter | Chat Completions | `OPENROUTER_API_KEY` |
| OpenCode | Somente servidor/ponte compatível | Conforme instalação |
| Outros | Chat Completions compatível | Variável personalizada |

## Segurança e limitações

- O arquivo `.env` é ignorado pelo Git, mas **não é criptografado no disco**. Proteja sua conta de usuário e permissões de arquivos. Para produção, use um gerenciador de segredos.
- O arquivo de configuração JSON não armazena chaves.
- O histórico é temporário e os textos resumidos das atividades podem aparecer no escritório e na linha do tempo local do Habblaud. Não envie segredos nos prompts.
- Provedores externos podem cobrar por tokens; confirme os preços e cotas.
- Não exponha a porta HTTP local à internet.
- Esta extensão não implementa agentes com ferramentas, streaming, modelos multimodais ou chamadas de funções.
- A integração original do Habblaud World deve ser avaliada antes de publicar informações de atividade de agentes.

## Créditos, licença e projeto original

**Projeto original:** [marmottajr/habblaud](https://github.com/marmottajr/habblaud) — Habblaud v1.0.3, licença MIT. **Adaptação comunitária:** Walney Moreira Klein — walneyk@hotmail.com.

Esta adaptação não representa uma versão oficial do autor original. Os arquivos de licença e os créditos originais devem ser preservados. Consulte também o [README original](README.md) e a [licença](LICENSE).

## Estado dos testes

O build e o typecheck da primeira integração passaram e uma chamada real ao Ollama Qwen 3B respondeu corretamente. A suíte completa de testes apresentou falhas em módulos preexistentes; não há certificação de aprovação total. Cada novo provedor deve ser testado com credenciais próprias.
