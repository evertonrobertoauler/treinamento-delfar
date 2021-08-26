import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { SERVICOS, BancoDadosService, UsuariosService } from './servicos';
import { CONTROLLERS } from './controllers';
import { GUARDAS } from './guardas';

@Module({
  imports: [],
  controllers: [...CONTROLLERS],
  providers: [...SERVICOS, ...GUARDAS],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private bd: BancoDadosService,
    private usuarios: UsuariosService,
  ) {}

  async onModuleInit() {
    await this.bd.conectarBancoDados();

    if ((await this.usuarios.listarUsuarios()).length === 0) {
      await this.usuarios.criarUsuarioPadrao();
    }
  }

  async onModuleDestroy() {
    await this.bd.desconectarBancoDados();
  }
}
