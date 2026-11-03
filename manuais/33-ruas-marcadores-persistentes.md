# Manual 33 — Ruas OSM e marcadores persistentes

Créditos: Walney Moreira Klein — walneyk@hotmail.com.

## Diferença entre as opções de ruas

Sobrepor mapa OSM: usa tiles raster com nomes de ruas impressos no mapa, cobrindo parcialmente a imagem de satélite. É a opção mais confiável para visualização imediata.

Mostrar nomes de ruas no globo: consulta Overpass para criar etiquetas Cesium independentes. A API pode falhar. Nesta versão, uma falha de Overpass ativa automaticamente a camada OSM como alternativa. As duas camadas são tecnicamente distintas e podem ser combinadas, mas etiquetas podem se sobrepor.

## Marcadores favoritos

O clique no globo cria um marcador provisório. Para preservá-lo, use Salvar ponto como favorito e confirme o formulário. O preset pessoal fica no localStorage. A página pai envia os presets para o iframe pela mensagem gev:favorite-markers; God's Eye View recria entidades Cesium com nome e ícone. Ao carregar o globo, editar, importar ou excluir favoritos, a lista é sincronizada novamente. Excluir um preset pessoal também remove seu marcador visual.

## Arquivos e customização

community/geo-mission.html: syncFavoriteMarkers, persistPresets, formulário presetForm, evento load do iframe, refreshGeoLabels.

src/app/embed.js no projeto God's Eye View: setFavorites e receptor gev:favorite-markers. Altere pixelSize, Cesium.Color.ORANGE, distanceDisplayCondition e label para personalizar os ícones.

## Testes

Marque um ponto, clique Salvar ponto como favorito, confirme o nome, atualize a página e visite o local. Verifique o marcador persistente. Exclua o preset e confirme a remoção. Ative nomes de ruas com Overpass indisponível e confira a ativação automática do mapa OSM. Não publique coordenadas de residências em repositórios.

## Limitações

Os favoritos são locais ao navegador, não sincronizados entre computadores. Os nomes do mapa OSM são pixels de tiles, não objetos clicáveis. O serviço público de tiles tem política de uso e não deve ser tratado como ilimitado.
