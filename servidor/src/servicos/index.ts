import { BancoDadosService } from './banco-dados.service';
import { UsuariosService } from './usuarios.service';

export * from './banco-dados.service';
export * from './usuarios.service';

export const SERVICOS = [BancoDadosService, UsuariosService];
