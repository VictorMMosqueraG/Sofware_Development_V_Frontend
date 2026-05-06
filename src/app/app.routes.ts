import { Routes } from '@angular/router';
import { Customers }    from './ui/pages/customers/customers';
import { CashReceipts } from './ui/pages/cash-receipts/cash-receipts';
import { CashReceiptDetails } from './ui/pages/cash-receipt-details/cash-receipt-details';

export const routes: Routes = [
  { path: '',                    redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers',          component: Customers    },
  { path: 'cash-receipts',      component: CashReceipts },
  { path: 'cash-receipt-details', component: CashReceiptDetails },
  { path: '**',                  redirectTo: 'customers'  },
];
