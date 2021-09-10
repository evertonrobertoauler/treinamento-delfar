import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

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

  @Get('opcoes')
  async listarOpcoesClientes() {
    return await this.clientes.consultarOpcoesClientes();
  }

  @Get('opcoes/endereco/:cliente')
  async listarOpcoesEnderecoCliente(@Param('cliente') cliente: number) {
    console.log('listarOpcoesEnderecoCliente', cliente)
    return await this.clientes.consultarOpcoesEnderecos(cliente);
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
