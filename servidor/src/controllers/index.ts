import { AutenticacaoController } from './autenticacao.controller';
import { PedidosController } from './pedidos.controller';

export * from './autenticacao.controller';
export * from './pedidos.controller';

export const CONTROLLERS = [AutenticacaoController, PedidosController];
