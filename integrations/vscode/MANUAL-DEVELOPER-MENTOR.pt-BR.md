# Habblaud Developer Mentor — Manual do programador

Créditos: Walney Moreira Klein — walneyk@hotmail.com

## Objetivo
Usar IA como apoio ao raciocínio e à produtividade, preservando o conhecimento do programador, o controle das alterações e as regras de negócio.

## Recursos disponíveis nesta primeira entrega
Na extensão VS Code, o comando Habblaud: Analisar seleção com agente ou Analisar documento aberto oferece quatro tarefas adicionais:
1. Mentor: me ensine este código.
2. Raio-X: riscos e dependências.
3. Modernização sem reescrever tudo.
4. Revisão de regressões.

As tarefas são análises de texto geradas por modelo. Não fazem varredura completa do repositório, não executam testes e não garantem detectar todos os problemas.

## Tutorial
1. Inicie o servidor Habblaud e configure um agente e provedor.
2. Instale ou atualize a extensão em integrations/vscode.
3. Abra um arquivo e selecione um trecho de até 5.000 caracteres, ou use análise de documento de até 6.000 caracteres.
4. Abra a paleta de comandos Ctrl+Shift+P e selecione a análise desejada.
5. Escolha um agente e uma das quatro tarefas do Developer Mentor.
6. Autorize o envio do código. Confira se o provedor é local ou externo.
7. Leia o relatório em Markdown aberto pelo VS Code.
8. Verifique afirmações, execute testes e aprove mudanças apenas depois de revisão.

## Exemplo prático: modernização de código legado
Selecione uma função de cálculo de pagamento. Peça Modernização sem reescrever tudo.
Verifique se a resposta identifica arredondamento, datas, efeitos colaterais e testes de caracterização. Não substitua regras de negócio sem comparar resultados anteriores.

## Exercício
Pegue uma função com validação de valores e peça ao agente três testes de regressão. Implemente os testes manualmente. Depois compare o resultado real com o que o agente sugeriu.

## Próximos módulos
Raio-X de repositório inteiro, mapa visual de dependências, testes de caracterização executáveis, trilhas de estudo personalizadas, comparação de tecnologias e painel de dívida técnica.

## Segurança
O envio a provedores externos pode compartilhar código proprietário. Não envie senhas, chaves, dados pessoais ou segredos. O modelo pode errar; validação humana continua obrigatória.
