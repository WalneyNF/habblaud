# Manual 32 — Catálogo e dossiê geográfico

Créditos: Walney Moreira Klein — walneyk@hotmail.com.

O Geo Data Hub possui um catálogo de cinco APIs. Cada caixa ativa ou desativa a consulta ao provedor correspondente. Preferências são guardadas no navegador.

O dossiê reúne as coordenadas, data, fonte, resultados e falhas de cada consulta. O botão Exportar GeoJSON cria uma FeatureCollection com um Point, usando a ordem longitude, latitude. O botão Copiar relatório gera um resumo textual.

Para integrar outra API: (1) adicione seu id e nome ao array PROVIDERS; (2) crie um cartão com id e elemento .items; (3) acrescente moduleLoad com request e line; (4) autorize o domínio HTTPS em connect-src no arquivo server/geo-bridge.ts; (5) documente licença, atribuição, limites e precisão; (6) teste falhas HTTP, timeout e dados vazios.

Arquivos: community/geo-data-hub.html, community/geo-mission.html, server/geo-bridge.ts. O Manual 31 descreve as cinco APIs originais.

Privacidade: GeoJSON pode conter coordenadas de locais particulares. Não compartilhe arquivos com pontos residenciais sem intenção explícita.

Teste: consulte um local, desligue uma fonte, consulte novamente, verifique o dossiê e exporte GeoJSON. Reinicie o Habblaud após recompilar o backend.
