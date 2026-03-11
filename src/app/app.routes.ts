import { Routes } from '@angular/router';
import { Customers }    from './ui/pages/customers/customers';
import { CashReceipts } from './ui/pages/cash-receipts/cash-receipts';

export const routes: Routes = [
  { path: '',             redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers',   component: Customers    },
  { path: 'cash-receipts', component: CashReceipts },
  { path: '**',           redirectTo: 'customers'  },
];
