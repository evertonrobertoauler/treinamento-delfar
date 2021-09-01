import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ComunModule } from '../../comun';

import { ListagemComponent } from './listagem/listagem.component';
import { FormularioComponent } from './formulario/formulario.component';

@NgModule({
  declarations: [ListagemComponent, FormularioComponent],
  imports: [
    CommonModule,
    ComunModule,
    RouterModule.forChild([
      { path: '', component: ListagemComponent },
      { path: 'adicionar', component: FormularioComponent },
      { path: ':id', component: FormularioComponent }
    ])
  ]
})
export class ClientesModule {}
