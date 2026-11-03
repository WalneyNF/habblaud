Manual 29 — Diagnóstico de etiquetas de ruas no Geo Mission BR

Créditos: Walney Moreira Klein — walneyk@hotmail.com.

Problema: o status anterior dizia 'Ruas atualizadas nesta região' mesmo depois de falhas da API. A variável de região era atualizada antes de validar uma resposta com ruas. Isso escondia novas tentativas automáticas.

Correção: o módulo passa a registrar sucesso apenas quando há ruas nomeadas válidas, guarda quantidade de etiquetas enviadas ao globo e informa claramente ausência de resultados, falha de rede ou timeout. O botão 'Atualizar ruas agora' força nova consulta, respeitando o intervalo mínimo de 30 segundos. Desligar a camada limpa o estado de sucesso e as etiquetas.

Como ajustar: no arquivo community/geo-mission.html, procure refreshGeoLabels, labelsLastSuccess, labelsLastCount, labelsLastCenter e labelsLastAt. Não defina labelsLastSuccess antes de validar os elementos retornados. No God's Eye View, a mensagem gev:geo-labels desenha as entidades Cesium. Consulte o Manual 28 para instâncias Overpass e cache.

Testes: (1) simular falha de rede e verificar mensagem de falha; (2) aguardar intervalo e tentar novamente; (3) obter lista vazia e verificar 'nenhuma rua'; (4) obter vias nomeadas e verificar quantidade; (5) desligar e ligar novamente e confirmar remoção das etiquetas.

Privacidade: para favoritos residenciais, não publique coordenadas privadas em GitHub ou manuais. 'Salvar local exibido' captura o centro da câmera, que pode ser aproximado; confirme o ponto antes de salvar.

Limitação: esta correção resolve a lógica de estados, mas não garante disponibilidade dos servidores Overpass nem valida a visualização final de etiquetas no Cesium. Para uso em produção, utilizar provedor de tiles cartográficos ou backend próprio com cache e limites.
