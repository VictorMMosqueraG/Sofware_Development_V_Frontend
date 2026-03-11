import { Observable } from "rxjs";
import {
  CreateCustomerRequest,
  Customer,
  CustomerSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateCustomerRequest }
 from "../../models";


export abstract class CustomerUseCase {
  abstract create(
    request: CreateCustomerRequest): Observable<ResultDto>;

  abstract getAll(
    query: CustomerSearchQuery
  ): Observable<PaginatedResultDto<Customer[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Customer>>;

  abstract update(
    id: number,
    request: UpdateCustomerRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
