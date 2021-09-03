import { AutenticacaoController } from './autenticacao.controller';
import { PedidosController } from './pedidos.controller';
import { ClientesController } from './clientes.controller';

export * from './autenticacao.controller';
export * from './pedidos.controller';
export * from './clientes.controller'

export const CONTROLLERS = [AutenticacaoController, PedidosController, ClientesController];
