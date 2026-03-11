import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CustomerService } from './domain/service/customer.service';
import { CustomerUseCase } from './domain/usecase/customers/customer.usecase';
import { CustomerHttpService } from './infrastructure/driven-adapter/customer-http.service';
import { CustomerImplUseCase } from './domain/usecase/customers/customer-impl.usecase';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: CustomerService, useClass: CustomerHttpService },
    { provide: CustomerUseCase, useClass: CustomerImplUseCase },
  ],
};
