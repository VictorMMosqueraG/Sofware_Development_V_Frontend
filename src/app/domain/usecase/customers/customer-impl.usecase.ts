import { Injectable } from "@angular/core";
import { CustomerUseCase } from "./customer.usecase";
import { CustomerService } from "../../service/customer.service";
import {
  CreateCustomerRequest,
  Customer,
  CustomerSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateCustomerRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class CustomerImplUseCase extends CustomerUseCase {

  constructor(private customerService: CustomerService) {
    super();
  }

  create(request: CreateCustomerRequest): Observable<ResultDto> {
    return this.customerService.create(request);
  }

  getAll(query: CustomerSearchQuery): Observable<PaginatedResultDto<Customer[]>> {
    return this.customerService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Customer>> {
    return this.customerService.getById(id);
  }

  update(id: number, request: UpdateCustomerRequest): Observable<ResultDto> {
    return this.customerService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.customerService.delete(id);
  }
}
