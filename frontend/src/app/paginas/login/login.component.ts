import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ApiService } from '../../servicos';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formulario = this.formBuilder.group({
    usuario: [null, [Validators.required, Validators.email]],
    senha: [null, [Validators.required, Validators.minLength(8)]],
  });

  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  async login() {
    this.api.consultarApi('POST', 'login', this.formulario.getRawValue());
  }
}
