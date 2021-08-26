import { Controller, Get, UseGuards } from '@nestjs/common';

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
}
