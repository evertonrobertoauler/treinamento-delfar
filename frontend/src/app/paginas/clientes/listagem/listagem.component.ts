import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService, UteisService } from '@app/servicos';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.scss']
})
export class ListagemComponent {
  dados$ = this.uteis.combineLatestObj({
    clientes: this.clientes.consultarClientes()
  });

  constructor(
    private clientes: ClientesService,
    private uteis: UteisService,
    private router: Router
  ) {}

  editarCliente(cliente?: any) {
    this.clientes.clientes$.next(cliente || null);
    return this.router.navigateByUrl(cliente ? '/clientes/' + cliente.id : '/clientes/adicionar');
  }
}
