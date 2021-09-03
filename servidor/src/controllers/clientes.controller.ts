import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AutenticacaoGuard } from '../guardas';
import { ClientesService } from '../servicos';

@Controller('clientes')
@UseGuards(AutenticacaoGuard)
export class ClientesController {
  constructor(private clientes: ClientesService) {}

  @Get()
  async listarClientes() {
    return await this.clientes.consultarClientes();
  }

  @Post('salvar')
  async salvarCliente(@Body() cliente: any) {
    return await this.clientes.salvarCliente(cliente);
  }

  @Post('excluir')
  async excluirCliente(@Body() cliente: any) {
    return await this.clientes.excluirCliente(cliente);
  }
}
