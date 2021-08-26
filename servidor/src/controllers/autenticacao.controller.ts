import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UsuariosService } from 'src/servicos';

@Controller('')
export class AutenticacaoController {
  constructor(private usuarios: UsuariosService) {}

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
  async logout(@Session() session: Record<string, any>) {
    if (session.usuario) {
      session.usuario = null;
      return { resultado: true };
    } else {
      return { resultado: false };
    }
  }
}
