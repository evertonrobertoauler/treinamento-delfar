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
    return [{id: 1, nome: 'Joãozinho'}];
  }

  @Get('opcoes/endereco/:cliente')
  async listarOpcoesEnderecoCliente(@Param('cliente') cliente: number) {
    console.log('listarOpcoesEnderecoCliente', cliente)
    return [{id: 1, rua: 'Rua ABC', numero: 123, complemento: '', bairro: 'Centro', cidade: 'Carazinho'} ];
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
