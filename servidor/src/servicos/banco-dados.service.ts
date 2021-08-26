import { Injectable } from '@nestjs/common';
import { Connection, createConnection, Repository } from 'typeorm';

@Injectable()
export class BancoDadosService {
  private conn: Connection;

  async conectarBancoDados() {
    this.conn = await createConnection({
      type: 'postgres',
      host: '0.0.0.0',
      port: 5432,
      username: 'samuel',
      password: 'senha123',
      database: 'pedidos',
      entities: [__dirname + '/../entidades/**/*{.ts,.js}'],
      synchronize: true,
    });
  }

  obterEntidade<T>(classe: any) {
    return this.conn.getRepository(classe) as Repository<T>;
  }

  async executarConsulta<T>(sql: string, parametros?: any[]) {
    return (await this.conn.query(sql, parametros)) as T;
  }

  async desconectarBancoDados() {
    if (this.conn && this.conn.isConnected) {
      await this.conn.close();
    }
  }
}
