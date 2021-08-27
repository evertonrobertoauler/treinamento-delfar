import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ApiService } from '../../../servicos';

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

  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  async salvar() {
    await this.api.consultarApi('POST', 'salvar', this.formulario.getRawValue());
  }

  async excluir() {
    await this.api.consultarApi('POST', 'excluir', { id: this.formulario.value.id });
  }
}
