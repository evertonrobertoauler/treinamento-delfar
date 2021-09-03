import { Injectable } from '@nestjs/common';
import { Endereco, Cliente } from '../entidades';
import { BancoDadosService } from './banco-dados.service';

@Injectable()
export class ClientesService {
  constructor(private bd: BancoDadosService) {}

  async consultarClientes() {
    const sql = `
      WITH 
        with_endereco AS (
          SELECT ip.*
            FROM endereco ip
           ORDER BY "clienteId"
        ),
        with_endereco_json AS (
          SELECT w."clienteId", JSON_AGG(ROW_TO_JSON(w)) AS enderecos
            FROM with_endereco w
           GROUP BY 1
        ),
        with_clientes AS (
          SELECT pe.*, wip.enderecos
            FROM cliente                  pe 
            JOIN with_endereco_json wip ON wip."clienteId" = pe.id
           ORDER BY pe.id
        )

       SELECT JSON_AGG(ROW_TO_JSON(w)) AS registros
         FROM with_clientes w
    `;

    const resultado = await this.bd.executarConsulta(sql);
    return resultado?.length ? resultado[0]?.registros : [];
  }

  async salvarCliente(dados: any) {
    let cliente = new Cliente();
    cliente.id = dados.id || null;
    cliente.nome = dados.nome;
    cliente.email = dados.email;
    cliente.contato = dados.contato;
    cliente = await this.bd.obterEntidade(Cliente).save(cliente);

    const idEnderecos = [];

    for (const dadosEndereco of dados.enderecos) {
      const endereco = new Endereco();
      endereco.id = dadosEndereco.id || null;
      endereco.cliente = cliente;
      endereco.cidade = dadosEndereco.cidade;
      endereco.bairro = dadosEndereco.bairro;
      endereco.rua = dadosEndereco.rua;
      endereco.numero = dadosEndereco.numero;
      endereco.complemento = dadosEndereco.complemento;
      idEnderecos.push((await this.bd.obterEntidade(Endereco).save(endereco)).id);
    }

    const itens = await this.bd
      .obterEntidade<Endereco>(Endereco)
      .createQueryBuilder()
      .where('"clienteId" = :cliente', { cliente: cliente.id })
      .getMany();

    for (const item of itens.filter((i) => !idEnderecos.includes(i.id))) {
      await this.bd.obterEntidade(Endereco).delete(item);
    }

    return cliente;
  }

  async excluirCliente(dados: any) {
    const enderecos = await this.bd
      .obterEntidade<Endereco>(Endereco)
      .createQueryBuilder()
      .where('"clienteId" = :cliente', { cliente: dados.id })
      .getMany();

    for (const endereco of enderecos) {
      await this.bd.obterEntidade(Endereco).delete(endereco);
    }

    let cliente = new Cliente();
    cliente.id = dados.id || null;
    return await this.bd.obterEntidade(Cliente).delete(cliente);
  }
}
