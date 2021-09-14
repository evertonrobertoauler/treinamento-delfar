WITH     
  with_itens_pedido AS (
    SELECT pe."clienteId", 
           SUM(ip.quantidade)                                 AS quantidade, 
           SUM(ip.valor * ip.quantidade) / SUM(ip.quantidade) AS media, 
           SUM(ip.valor * ip.quantidade)                      AS total_itens
      FROM pedido      pe
      JOIN item_pedido ip ON ip."pedidoId" = pe.id
     GROUP BY 1
  )

SELECT cl.nome             AS cliente,
       wip.quantidade      AS qtd_itens,
       wip.media           AS media_valor_itens,
       wip.total_itens     AS total_itens,
       COUNT(pe.id)        AS qntd_pedidos, 
       SUM(pe.valor)       AS total
  FROM pedido            pe
  JOIN cliente           cl  ON cl.id           = pe."clienteId"
  JOIN with_itens_pedido wip ON wip."clienteId" = pe."clienteId"
 GROUP BY 1, 2, 3, 4
 ORDER BY cl.nome;
