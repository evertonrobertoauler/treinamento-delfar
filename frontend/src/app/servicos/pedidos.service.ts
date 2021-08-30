import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  pedido$ = new BehaviorSubject(null);

  constructor(private api: ApiService) {}

  async consultarPedidos() {
    return this.api.consultarApi<any[]>('GET', 'pedidos');
  }

  async salvarPedido(pedido: any) {
    return await this.api.consultarApi('POST', 'pedidos/salvar', pedido);
  }

  async excluirPedido(id: number) {
    return await this.api.consultarApi('POST', 'pedidos/excluir', { id });
  }
}
