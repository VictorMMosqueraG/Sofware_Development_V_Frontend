import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'recibos',
    loadComponent: () =>
      import('./features/recibos/pages/recibo-list.page/recibo-list.page')
        .then(m => m.ReciboListPage)
  },
  {
    path: 'recibos/nuevo',
    loadComponent: () =>
      import('./features/recibos/pages/recibo-form.page/recibo-form.page')
        .then(m => m.ReciboFormPage)
  },
  {
  path: 'recibos/editar/:id',
  loadComponent: () =>
    import('./features/recibos/pages/recibo-form.page/recibo-form.page')
      .then(m => m.ReciboFormPage)
  },
  {
    path: '',
    redirectTo: 'recibos',
    pathMatch: 'full'
  }
];
