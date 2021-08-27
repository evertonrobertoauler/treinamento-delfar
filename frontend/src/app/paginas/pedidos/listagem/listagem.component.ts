import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService, UteisService } from '@app/servicos';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.scss']
})
export class ListagemComponent {
  dados$ = this.uteis.combineLatestObj({
    pedidos: this.pedidos.consultarPedidos()
  });

  constructor(
    private pedidos: PedidosService,
    private uteis: UteisService,
    private router: Router
  ) {}

  editarPedido(pedido?: any) {
    this.pedidos.pedido$.next(pedido || null);
    return this.router.navigateByUrl(pedido ? '/' + pedido.id : '/adicionar');
  }
}
