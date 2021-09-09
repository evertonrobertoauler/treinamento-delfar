import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { defer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApiService } from './servicos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  logado$ = defer(() => this.api.consultarApi('GET', 'logado').catch(() => null))
    .pipe(switchMap(() => this.api.logado$))
    .pipe(tap(logado => this.ajustarNavegacao(logado)));

  constructor(private api: ApiService, private router: Router) {}

  async sair() {
    await this.api.consultarApi('GET', 'logout');
  }

  async pedidos(){
    this.router.navigateByUrl('/pedidos');
  }
  
  async clientes(){
    this.router.navigateByUrl('/clientes');
  }

  private async ajustarNavegacao(logado: boolean) {
    if (logado && this.router.url === '/login') {
      await this.router.navigateByUrl('/');
    } else if (!logado && this.router.url !== '/login') {
      await this.router.navigateByUrl('/login');
    }
  }
}
