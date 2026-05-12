import { Observable } from "rxjs";
import {
  CreatePaymentMethodRequest,
  PaymentMethod,
  PaymentMethodSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePaymentMethodRequest }
 from "../../models";


export abstract class PaymentMethodUseCase {
  abstract create(
    request: CreatePaymentMethodRequest): Observable<ResultDto>;

  abstract getAll(
    query: PaymentMethodSearchQuery
  ): Observable<PaginatedResultDto<PaymentMethod[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<PaymentMethod>>;

  abstract update(
    id: number,
    request: UpdatePaymentMethodRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
