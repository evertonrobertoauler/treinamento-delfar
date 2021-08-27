import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { DIRETIVAS } from './diretivas';
import { COMPONENTES } from './componentes';

@NgModule({
  declarations: [...DIRETIVAS, ...COMPONENTES],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  exports: [HttpClientModule, ReactiveFormsModule, ...DIRETIVAS, ...COMPONENTES]
})
export class ComunModule {}
