import { Injectable } from '@nestjs/common';
import { Pedido } from '../entidades';
import { BancoDadosService } from './banco-dados.service';

@Injectable()
export class PedidosService {
  constructor(private bd: BancoDadosService) {}

  async consultarPedidos() {
    const sql = `
      WITH 
        with_itens_pedidos AS (
          SELECT ip.*, ip.quantidade * ip.valor AS total
            FROM item_pedido ip
           ORDER BY "pedidoId", total DESC 
        ),
        with_itens_pedidos_json AS (
          SELECT w."pedidoId", JSON_AGG(ROW_TO_JSON(w)) AS itens
            FROM with_itens_pedidos w
           GROUP BY 1
        ),
        with_pedidos AS (
          SELECT pe.*, wip.itens
            FROM pedido                  pe 
            JOIN with_itens_pedidos_json wip ON wip."pedidoId" = pe.id
           ORDER BY pe.id
        )

       SELECT JSON_AGG(ROW_TO_JSON(w)) AS registros
         FROM with_pedidos w
    `;

    const resultado = await this.bd.executarConsulta(sql);
    return resultado?.length ? resultado[0]?.registros : [];
  }
}
