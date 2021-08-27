import { Body, Controller, Get, Post } from '@nestjs/common';
import { Session, UseGuards } from '@nestjs/common';
import { AutenticacaoGuard } from 'src/guardas';
import { UsuariosService } from 'src/servicos';

@Controller('')
export class AutenticacaoController {
  constructor(private usuarios: UsuariosService) {}

  @Get('logado')
  @UseGuards(AutenticacaoGuard)
  async verificarSeTaLogado() {
    return { resultado: true };
  }

  @Post('login')
  async login(@Body() dados, @Session() session: Record<string, any>) {
    const usuario = await this.usuarios.login(dados.usuario, dados.senha);

    if (usuario) {
      session.usuario = usuario.id;
      return { resultado: true };
    } else {
      session.usuario = null;
      return { resultado: false };
    }
  }

  @Get('logout')
  @UseGuards(AutenticacaoGuard)
  async logout(@Session() session: Record<string, any>) {
    session.usuario = null;
    return { resultado: true };
  }
}
