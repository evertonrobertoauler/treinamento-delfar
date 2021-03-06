import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { ClientesService, UteisService } from '../../../servicos';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {
  arrEnderecos = this.formBuilder.array([]);

  formulario = this.formBuilder.group({
    id: [],
    nome: [null, Validators.required],
    email: [null, Validators.required],
    contato: [null, Validators.required],
    enderecos: this.arrEnderecos,
  });
  private dadosFormulario$ = this.clientes.clientes$
    .pipe(tap(p => (p?.enderecos || [null]).map(() => this.adicionarEndereco())))
    .pipe(tap(p => p && this.formulario.patchValue(p)))

  dados$ = this.uteis.combineLatestObj({
    dadosFormulario: this.dadosFormulario$,
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private uteis: UteisService,
    private clientes: ClientesService
  ) {}

  async salvar() {
    await this.clientes.salvarClientes(this.formulario.getRawValue());
    this.router.navigateByUrl('/clientes');
  }

  async excluir() {
    await this.clientes.excluirClientes(this.formulario.value.id);
    this.router.navigateByUrl('/clientes');
  }

  adicionarEndereco() {
    const grupoEndereco = this.formBuilder.group({
      id: [null],
      cidade: [null, Validators.required],
      bairro: [null, Validators.required],
      rua: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null]
    });

    this.arrEnderecos.push(grupoEndereco);
  }

  removerEndereco(index: number) {
    this.arrEnderecos.removeAt(index);
  }

}