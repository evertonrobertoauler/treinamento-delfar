import { Injectable } from '@nestjs/common';
import { ItemPedido, Pedido } from '../entidades';
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

  async salvarPedido(dados: any) {
    let pedido = new Pedido();
    pedido.id = dados.id || null;
    pedido.cliente = dados.cliente;
    pedido.endereco = dados.endereco;
    pedido.valor = dados.valor;
    pedido = await this.bd.obterEntidade(Pedido).save(pedido);

    const idItens = [];

    for (const dadosItem of dados.itens) {
      const item = new ItemPedido();
      item.id = dadosItem.id || null;
      item.pedido = pedido;
      item.nome = dadosItem.nome;
      item.quantidade = dadosItem.quantidade;
      item.valor = dadosItem.valor;
      idItens.push((await this.bd.obterEntidade(ItemPedido).save(item)).id);
    }

    const itens = await this.bd
      .obterEntidade<ItemPedido>(ItemPedido)
      .createQueryBuilder()
      .where('"pedidoId" = :pedido', { pedido: pedido.id })
      .getMany();

    for (const item of itens.filter((i) => !idItens.includes(i.id))) {
      await this.bd.obterEntidade(ItemPedido).delete(item);
    }

    return pedido;
  }

  async excluirPedido(dados: any) {
    const itens = await this.bd
      .obterEntidade<ItemPedido>(ItemPedido)
      .createQueryBuilder()
      .where('"pedidoId" = :pedido', { pedido: dados.id })
      .getMany();

    for (const item of itens) {
      await this.bd.obterEntidade(ItemPedido).delete(item);
    }

    let pedido = new Pedido();
    pedido.id = dados.id || null;
    return await this.bd.obterEntidade(Pedido).delete(pedido);
  }
}
