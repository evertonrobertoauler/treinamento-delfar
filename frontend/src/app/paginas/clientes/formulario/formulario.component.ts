import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toPairs } from 'lodash-es';
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
    .pipe(tap(p => p && this.formulario.patchValue(p)))
    .pipe(tap(() => this.formulario.get('valor').disable()));

  private atualizarTotais$ = this.uteis
    .mudanca(this.arrItens)
    .pipe(tap(() => this.atualizarTotais()));

  dados$ = this.uteis.combineLatestObj({
    valorAtual: this.valorAtual$,
    atualizarTotais: this.atualizarTotais$
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private uteis: UteisService,
    private pedidos: PedidosService
  ) {}

  async salvar() {
    await this.pedidos.salvarPedido(this.formulario.getRawValue());
    this.router.navigateByUrl('/clientes');
  }

  async excluir() {
    await this.pedidos.excluirPedido(this.formulario.value.id);
    this.router.navigateByUrl('/clientes');
  }

  adicionarItem() {
    const grupoItem = this.formBuilder.group({
      id: [null],
      nome: [null, Validators.required],
      quantidade: [null, Validators.required],
      valor: [null, Validators.required],
      total: [null, Validators.required]
    });

    grupoItem.get('total').disable();

    this.arrItens.push(grupoItem);
  }

  removerItem(index: number) {
    this.arrItens.removeAt(index);
  }

  private atualizarTotais() {
    let valor = 0;

    for (const [index, item] of toPairs(this.arrItens.getRawValue())) {
      const total = (item.quantidade || 0) * (item.valor || 0);

      valor = valor + total;

      if (item.total !== total) {
        this.arrItens.at(parseInt(index)).patchValue({ total });
      }
    }

    if (valor !== this.formulario.value.valor) {
      this.formulario.patchValue({ valor });
    }
  }
}
