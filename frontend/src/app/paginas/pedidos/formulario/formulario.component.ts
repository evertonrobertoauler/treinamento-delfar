import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';

import { PedidosService, UteisService } from '../../../servicos';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {
  formulario = this.formBuilder.group({
    id: [],
    cliente: [null, Validators.required],
    // itens: [{id: 2, nome: "Refrigerante", quantidade: 2, valor: 10, pedidoId: 1, total: 20}]
    itens: this.formBuilder.array([]),
    valor: [null, Validators.required]
  });

  private valorAtual$ = this.pedidos.pedido$.pipe(tap(p => p && this.formulario.patchValue(p)));

  dados$ = this.uteis.combineLatestObj({
    valorAtual: this.valorAtual$
  });

  constructor(
    private formBuilder: FormBuilder,
    private uteis: UteisService,
    private pedidos: PedidosService
  ) {}

  async salvar() {
    await this.pedidos.salvarPedido(this.formulario.getRawValue());
  }

  async excluir() {
    await this.pedidos.excluirPedido(this.formulario.value.id);
  }
}
