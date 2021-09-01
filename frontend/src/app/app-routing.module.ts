import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./paginas/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'pedidos',
    loadChildren: () =>
      import('./paginas/pedidos/pedidos.module').then((m) => m.PedidosModule),
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./paginas/clientes/clientes.module').then((m) => m.ClientesModule), 
  },
  {
    path: '',
    redirectTo: '/pedidos',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
