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
  arrItens = this.formBuilder.array([]);

  formulario = this.formBuilder.group({
    id: [],
    cliente: [null, Validators.required],
    itens: this.arrItens,
    valor: [null, Validators.required]
  });

  private valorAtual$ = this.pedidos.pedido$
    .pipe(tap(p => (p?.itens || [null]).map(() => this.adicionarItem())))
    .pipe(tap(p => p && this.formulario.patchValue(p)));

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

  adicionarItem() {
    const grupoItem = this.formBuilder.group({
      id: [null, Validators.required],
      nome: [null, Validators.required],
      quantidade: [null, Validators.required],
      valor: [null, Validators.required],
      total: [null, Validators.required]
    });

    this.arrItens.push(grupoItem);
  }

  removerItem(index: number) {
    this.arrItens.removeAt(index);
  }
}
