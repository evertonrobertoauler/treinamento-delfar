import { Injectable } from '@nestjs/common';
import { Usuario } from '../entidades';
import { BancoDadosService } from './banco-dados.service';

@Injectable()
export class UsuariosService {
  constructor(private bd: BancoDadosService) {}

  async listarUsuarios() {
    return await this.bd.obterEntidade<Usuario>(Usuario).find();
  }

  async criarUsuarioPadrao() {
    const usuario = new Usuario();
    usuario.nome = 'Samuel';
    usuario.usuario = 'samuel';
    usuario.senha = 'senha123';
    await this.bd.obterEntidade(Usuario).insert(usuario);
  }

  async login(usuario: string, senha: string) {
    const obj = await this.bd
      .obterEntidade(Usuario)
      .createQueryBuilder()
      .where('usuario = :usuario AND senha = :senha', { usuario, senha })
      .getOne();

    return obj as Usuario;
  }
}
