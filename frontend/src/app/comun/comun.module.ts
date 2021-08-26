import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { DIRETIVAS } from './diretivas';

@NgModule({
  declarations: [...DIRETIVAS],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  exports: [HttpClientModule, ReactiveFormsModule, ...DIRETIVAS],
})
export class ComunModule {}
