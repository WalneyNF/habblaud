# Manual 31 — Geo Data Hub 0.1: integração de APIs públicas

**Créditos:** Walney Moreira Klein — walneyk@hotmail.com.

## Objetivo e arquitetura
O Geo Data Hub é uma página independente em `community/geo-data-hub.html`, acessível em `/geo-data-hub` pelo Habblaud e pelo botão no Geo Mission. Recebe latitude e longitude por parâmetros de URL (`?lat=-22.2819&lon=-42.5311`), mas **não consulta automaticamente**: exige clique em **Consultar APIs**. Isso evita consultas involuntárias e exposição de pontos privados.

A rota foi incluída em `server/geo-bridge.ts` e sua política CSP permite somente origens necessárias. Cada cartão chama `moduleLoad(id,fn,token)`; `request(url,ms)` implementa timeout e checagem HTTP; `render` mostra sucesso ou falha por provedor. Um token `seq` evita que respostas de uma consulta antiga substituam resultados novos. Dados externos passam por `esc()` antes de serem inseridos em HTML; URLs de artigos são construídas com ID numérico. Os resultados não são persistidos.

## Integração 1 — Open-Meteo Forecast
**Endpoint:** `https://api.open-meteo.com/v1/forecast`.
**Parâmetros:** `latitude`, `longitude`, `current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m`, `timezone=auto`.
**Dados usados:** temperatura, sensação térmica, umidade, vento, horário de observação/modelo.
**Modificar:** procure `moduleLoad('weather'` e altere a lista `current` de acordo com a documentação oficial: https://open-meteo.com/en/docs
**Limites:** uso gratuito sem chave para aplicações não comerciais dentro das condições do provedor; atribuição Open-Meteo e CC BY 4.0. Previsões são modelos, não leituras diretas em cada endereço.

## Integração 2 — Open-Meteo Air Quality
**Endpoint:** `https://air-quality-api.open-meteo.com/v1/air-quality`.
**Parâmetros:** `latitude`, `longitude`, `current=us_aqi,pm2_5,pm10`, `timezone=auto`.
**Dados:** índice de qualidade do ar (padrão EUA), partículas PM2.5 e PM10, horário.
**Modificar:** procure `moduleLoad('air'`; acrescente parâmetros oficiais como ozônio e NO₂ se disponíveis. Documentação: https://open-meteo.com/en/docs/air-quality-api
**Cuidado:** são estimativas de modelo em grade espacial, não medições do ar dentro de uma residência.

## Integração 3 — Open-Meteo Elevation
**Endpoint:** `https://api.open-meteo.com/v1/elevation`.
**Parâmetros:** `latitude`, `longitude`.
**Dados:** elevação estimada do terreno em metros.
**Modificar:** procure `moduleLoad('elevation'`. Documentação: https://open-meteo.com/en/docs/elevation-api
**Cuidado:** altitude de terreno não equivale à altitude de um telhado nem a um levantamento topográfico certificado.

## Integração 4 — Wikipédia / MediaWiki Geosearch
**Endpoint:** `https://pt.wikipedia.org/w/api.php`.
**Parâmetros:** `action=query`, `list=geosearch`, `gscoord=latitude|longitude`, `gsradius`, `gslimit=8`, `format=json`, `origin=*`.
**Dados:** artigos georreferenciados próximos, título, distância e ID de página. Os links usam `?curid=` com ID numérico.
**Modificar:** procure `moduleLoad('wiki'`. Altere `gslimit` para a quantidade de artigos ou o domínio para outro idioma. Documentação: https://www.mediawiki.org/wiki/API:Geosearch
**Cuidado:** a proximidade não prova que um artigo descreva exatamente o ponto escolhido.

## Integração 5 — USGS Earthquake Feed
**Endpoint:** `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson`.
**Dados:** terremotos de magnitude 4,5+ na última semana, em escala global. Os eventos **não são necessariamente próximos ao destino escolhido**.
**Modificar:** procure `moduleLoad('quake'` e substitua o feed por outra janela/magnitude oficialmente disponível; para consulta por raio, use a API FDSN Event com parâmetros geográficos, respeitando limites. Documentação: https://earthquake.usgs.gov/earthquakes/feed/v1.0/index.php

## Como adicionar a sexta API
1. Crie um cartão HTML `<section class="card" id="nova"><h2>Nova fonte</h2><div class="items">Aguardando consulta.</div><div class="source">Fonte e licença</div></section>`.
2. Inclua `nova` no array de cartões carregados.
3. Adicione `moduleLoad('nova',async()=>{const data=await request('https://api.exemplo.org/...');return line('Campo',data.campo)},token)` ao array `jobs`.
4. Permita **apenas o domínio necessário** em `connect-src` de `server/geo-bridge.ts`.
5. Valide a resposta, escape textos, documente licença, atribuição, atualização e limites de uso.
6. Teste falha, timeout, ausência de dados, coordenadas inválidas e múltiplos cliques.

## Testes e execução
No Habblaud: `npm run typecheck`, `npm run build:server` e reinicie o servidor. Abra `http://127.0.0.1:4747/geo-data-hub`. Consulte as coordenadas padrão de Nova Friburgo, depois outra cidade. Teste sem conexão para confirmar que cada cartão mostra seu próprio erro. O laboratório não garante disponibilidade contínua de serviços de terceiros.

## Evolução profissional
Para produção, mover integrações para adaptadores separados (`providers/weather.ts`, `providers/air.ts`, etc.), criar cache por coordenadas arredondadas e TTL específico por fonte, fila de requisições, limites por usuário, telemetria sem dados pessoais, testes automatizados com mocks, tratamento de CORS e painel de atribuição/licenças. Nunca presumir que uma API pública é gratuita para uso comercial ou ilimitado. Não publique coordenadas privadas em URLs compartilhadas.
