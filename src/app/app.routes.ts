import { Routes } from '@angular/router';
import { Customers } from './ui/pages/customers/customers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
  {
    path: 'customers',
    component: Customers,
  },
  {
    path: '**',
    redirectTo: 'customers',
  },
];
