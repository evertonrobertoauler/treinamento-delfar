import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  clientes$ = new BehaviorSubject(null);

  constructor(private api: ApiService) {}

  async consultarClientes() {
    return this.api.consultarApi<any[]>('GET', 'clientes');
  }

  async salvarClientes(cliente: any) {
    return await this.api.consultarApi('POST', 'clientes/salvar', cliente);
  }

  async excluirClientes(id: number) {
    return await this.api.consultarApi('POST', 'clientes/excluir', { id });
  }
}
