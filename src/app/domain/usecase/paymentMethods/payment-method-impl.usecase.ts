import { Injectable } from "@angular/core";
import { PaymentMethodUseCase } from "./payment-method.usecase";
import { PaymentMethodService } from "../../service/payment-method.service";
import {
  CreatePaymentMethodRequest,
  PaymentMethod,
  PaymentMethodSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePaymentMethodRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class PaymentMethodImplUseCase extends PaymentMethodUseCase {

  constructor(private paymentMethodService: PaymentMethodService) {
    super();
  }

  create(request: CreatePaymentMethodRequest): Observable<ResultDto> {
    return this.paymentMethodService.create(request);
  }

  getAll(query: PaymentMethodSearchQuery): Observable<PaginatedResultDto<PaymentMethod[]>> {
    return this.paymentMethodService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<PaymentMethod>> {
    return this.paymentMethodService.getById(id);
  }

  update(id: number, request: UpdatePaymentMethodRequest): Observable<ResultDto> {
    return this.paymentMethodService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.paymentMethodService.delete(id);
  }
}
