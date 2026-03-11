import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CustomerService } from './domain/service/customer.service';
import { CustomerUseCase } from './domain/usecase/customers/customer.usecase';
import { CustomerHttpService } from './infrastructure/driven-adapter/customer-http.service';
import { CustomerImplUseCase } from './domain/usecase/customers/customer-impl.usecase';
import { CashReceiptService } from './domain/service/cash-receipt.service';
import { CashReceiptUseCase } from './domain/usecase/cash-receipt/cash-receipt.usecase';
import { CashReceiptHttpService } from './infrastructure/driven-adapter/cash-receipt-http.service';
import { CashReceiptImplUseCase } from './domain/usecase/cash-receipt/cash-receipt-impl.usecase';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: CustomerService, useClass: CustomerHttpService },
    { provide: CustomerUseCase, useClass: CustomerImplUseCase },
    { provide: CashReceiptService, useClass: CashReceiptHttpService },
    { provide: CashReceiptUseCase, useClass: CashReceiptImplUseCase },
  ],
};
