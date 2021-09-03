import { BancoDadosService } from './banco-dados.service';
import { UsuariosService } from './usuarios.service';
import { PedidosService } from './pedidos.service';
import { ClientesService } from './clientes.service';

export * from './banco-dados.service';
export * from './usuarios.service';
export * from './pedidos.service';
export * from './clientes.service';

export const SERVICOS = [BancoDadosService, UsuariosService, PedidosService, ClientesService];
