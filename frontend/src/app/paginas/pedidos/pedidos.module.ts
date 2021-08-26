import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ComunModule } from '../../comun';

import { ListagemComponent } from './listagem/listagem.component';

@NgModule({
  declarations: [ListagemComponent],
  imports: [
    CommonModule,
    ComunModule,
    RouterModule.forChild([{ path: '', component: ListagemComponent }]),
  ],
})
export class PedidosModule {}
