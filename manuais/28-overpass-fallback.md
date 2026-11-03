# Manual 28 — Falhas Overpass HTTP 502 e recuperação de nomes de ruas

**Integração:** Walney Moreira Klein — walneyk@hotmail.com.

## Diagnóstico
HTTP 502 é uma resposta de gateway ou proxy que não obteve resposta válida do serviço de origem. Não indica falta de ruas em Nova Friburgo. Instâncias públicas Overpass podem apresentar sobrecarga, limitações de acesso e indisponibilidade.

## Correção implementada
O módulo `community/geo-mission.html` agora consulta `overpass.private.coffee` e, se falhar, tenta `overpass-api.de` de forma sequencial. O tempo máximo de cada tentativa é 14 segundos. A resposta deve conter `elements` e não pode trazer `remark` de erro. Um cache em `sessionStorage` mantém respostas por até uma hora, separado por coordenadas aproximadas e raio. Há intervalo mínimo de 30 segundos entre novas consultas para reduzir carga. A CSP de `server/geo-bridge.ts` foi atualizada.

## Personalização avançada
- **Instâncias**: procure `const endpoints` em `community/geo-mission.html`; use somente servidores autorizados e respeite suas políticas.
- **Tempo de espera**: ajuste `setTimeout(()=>controller.abort(),14000)` com cautela.
- **Cache**: ajuste `3600000` (milissegundos) para o tempo de validade, conforme a necessidade de atualização dos dados.
- **Limite**: ajuste `30000` (milissegundos) para o intervalo entre consultas. Não diminua indiscriminadamente para uso público.
- **Raio**: altere a variável `radius` (650, 1300 ou 2500 m) para diminuir o volume de resultados.
- **Consulta**: a variável `query` busca vias `[highway][name]`, devolvendo o centro de até 50 vias. Para detalhes completos, planeje tiles vetoriais, não consultas constantes ao Overpass.
- **Segurança**: se alterar origens externas, atualize `connect-src` no servidor. Nunca coloque credenciais privadas no JavaScript do navegador.

## Como testar
1. Recompile e reinicie o Habblaud: `npm run build:server` e `npm run start:ai`.
2. Abra `http://127.0.0.1:4747/geo-mission`, atualize com Ctrl+Shift+R e visite Nova Friburgo.
3. Aproxime o globo abaixo de 16 km, ative a camada de nomes de ruas e espere a consulta.
4. Veja no status qual instância respondeu ou a mensagem de erro detalhada.
5. Desligue a camada e confira que os rótulos desaparecem.

## Limitações
A disponibilidade dos servidores externos não é garantida. O fallback não elimina problemas de rede, CORS ou quotas. Ainda falta validação visual completa no Cesium. Para lançamento público, prefira tiles vetoriais ou backend com cache e limites, com atribuição OpenStreetMap/ODbL.
