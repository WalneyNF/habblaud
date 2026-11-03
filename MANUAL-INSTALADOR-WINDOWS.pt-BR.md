# Instalador Windows — Habblaud AI Community

**Adaptação comunitária:** Walney Moreira Klein — walneyk@hotmail.com  
**Projeto original:** [marmottajr/habblaud](https://github.com/marmottajr/habblaud), licença MIT.

## Instalação em três passos

1. Instale ou extraia o projeto numa pasta do Windows. Se o projeto estiver disponível no GitHub, clique em **Code → Download ZIP**, extraia o ZIP completamente e abra a pasta que contém `package.json`.
2. Dê **dois cliques em `INSTALAR-WINDOWS.cmd`**. O assistente verifica Node.js, npm, Git e Ollama, oferece instalar os programas ausentes via `winget` **somente com sua confirmação**, cria um `.env` sem chaves (se necessário), instala as dependências e compila o projeto.
3. Dê **dois cliques em `INICIAR-HABBLAUD.cmd`**. Abra o endereço informado no terminal. O laboratório de IA normalmente estará em `http://127.0.0.1:4747/ia-lab`.

> **Requisitos:** Windows com PowerShell, acesso à internet para baixar dependências, Node.js 22.12 ou superior. Ollama é opcional se usar um provedor na nuvem. O instalador não configura automaticamente suas chaves, não baixa modelos e não modifica projetos fora da pasta do Habblaud.

## O que cada arquivo faz?

| Arquivo | Função |
| --- | --- |
| `INSTALAR-WINDOWS.cmd` | Inicia o assistente de instalação |
| `INICIAR-HABBLAUD.cmd` | Inicia o servidor Node carregando o `.env` |
| `VERIFICAR-INSTALACAO.cmd` | Executa diagnóstico sem instalar nada |
| `scripts/instalar-windows.ps1` | Implementa o assistente |
| `.env.example` | Modelo seguro de configuração |
| `.env` | Configurações privadas, ignoradas pelo Git |

## Como instalar Ollama e um modelo

O instalador verifica se o Ollama está instalado e oferece instalar pelo Windows Package Manager (winget). **Ele não baixa modelos automaticamente**, pois modelos podem ocupar vários gigabytes.

Depois da instalação, abra um terminal e execute:

```bat
ollama pull qwen2.5-coder:3b
ollama list
```

Inicie o Ollama pelo aplicativo, se ainda não estiver ativo. No laboratório, selecione **Ollama local** e o modelo `qwen2.5-coder:3b`.

## Como usar Groq, OpenAI ou Gemini

Na pasta do projeto, abra o arquivo `.env` criado pelo instalador e preencha **somente** a variável correspondente ao serviço:

```dotenv
GROQ_API_KEY=SUA_CHAVE_PRIVADA
OPENAI_API_KEY=SUA_CHAVE_PRIVADA
GEMINI_API_KEY=SUA_CHAVE_PRIVADA
```

Reinicie `INICIAR-HABBLAUD.cmd` após alterar o arquivo. No laboratório, selecione o provedor, confira URL e modelo e envie uma pergunta. As chaves ficam no servidor local, não na interface. Elas são enviadas ao provedor externo escolhido para autenticar as chamadas. Nunca compartilhe o `.env`.

## Diagnóstico sem modificar nada

Dê dois cliques em `VERIFICAR-INSTALACAO.cmd`, ou execute:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\instalar-windows.ps1 -CheckOnly -NonInteractive
```

O diagnóstico não instala programas, não cria arquivos e não executa o build. Verifica requisitos e modelos locais.

## Para desenvolvedores e testes automatizados

```powershell
# Instala sem perguntas, respeitando programas já instalados:
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\instalar-windows.ps1 -NonInteractive

# Instala sem compilar (para diagnosticar instalação):
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\instalar-windows.ps1 -NonInteractive -SkipBuild
```

A opção `-StartAfterInstall` inicia o servidor ao final e mantém o terminal ocupado. **Não use essa opção em CI**.

## Erros e soluções

- **Node.js ausente:** aceite a oferta do winget ou instale manualmente pelo site oficial. Feche e abra o terminal após a instalação.
- **Winget ausente:** instale os pré-requisitos manualmente. O assistente não tenta downloads por links não verificados.
- **npm ci falhou:** confira internet, permissões e espaço livre. O instalador interrompe o processo e mostra o erro.
- **Build falhou:** execute `npm run typecheck` e `npm run build` e reporte a mensagem completa.
- **Ollama não responde:** abra o aplicativo e teste `http://127.0.0.1:11434/api/tags`.
- **Porta 4747 ocupada:** adicione `HABBLAUD_PORT=4750` ao `.env` e reinicie o servidor.
- **Chave não configurada:** edite o `.env` e reinicie o programa.
- **Unidade sem espaço:** libere espaço antes de instalar. O npm e o Ollama podem precisar de espaço fora da pasta do projeto.

## Segurança e limitações

O instalador usa `winget` somente após uma confirmação explícita, não exige execução como administrador para as etapas normais, não solicita nem grava API keys, não apaga arquivos do usuário e preserva `.env` existente. O arquivo `.env` não é criptografado. O uso de `-ExecutionPolicy Bypass` vale apenas para o processo iniciado pelo `.cmd`; ele não altera permanentemente a política do Windows.

**O instalador não é um executável MSI/EXE assinado:** é um assistente de PowerShell com inicializadores CMD. Futuramente poderá ser empacotado em um instalador assinado. O Windows pode exibir alertas de segurança; revise os scripts antes de executá-los.

Para comandos de Git, branches, versões e publicação, consulte [MANUAL-DESENVOLVEDOR.pt-BR.md](MANUAL-DESENVOLVEDOR.pt-BR.md).
