import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ComunModule } from '../../comun';

import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ComunModule,
    RouterModule.forChild([{ path: '', component: LoginComponent }]),
  ],
})
export class LoginModule {}
