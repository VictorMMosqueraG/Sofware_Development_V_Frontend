import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
  { path: 'pedidos', loadComponent: () => import('./ui/pages/pedidos/pedidos.component').then(m => m.PedidosComponent) }
];
