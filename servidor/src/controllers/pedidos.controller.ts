import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AutenticacaoGuard } from '../guardas';
import { PedidosService } from '../servicos';

@Controller('pedidos')
@UseGuards(AutenticacaoGuard)
export class PedidosController {
  constructor(private pedidos: PedidosService) {}

  @Get()
  async listarPedidos() {
    return await this.pedidos.consultarPedidos();
  }

  @Post('salvar')
  async salvarPedido(@Body() pedido: any) {
    return await this.pedidos.salvarPedido(pedido);
  }

  @Post('excluir')
  async excluirPedido(@Body() pedido: any) {
    return await this.pedidos.excluirPedido(pedido);
  }
}
