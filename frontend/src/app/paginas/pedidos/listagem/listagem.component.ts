import { Component } from '@angular/core';
import { ApiService, UteisService } from '../../../servicos';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.scss'],
})
export class ListagemComponent {
  private pedidos$ = this.api.consultarApi<any[]>('GET', 'pedidos');

  dados$ = this.uteis.combineLatestObj({
    pedidos: this.pedidos$,
  });

  constructor(private api: ApiService, private uteis: UteisService) {}
}
