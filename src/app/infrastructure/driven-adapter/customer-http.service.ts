import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { CustomerService } from "../../domain/service/customer.service";
import {
  CreateCustomerRequest,
  Customer,
  CustomerSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateCustomerRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class CustomerHttpService extends CustomerService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/customers`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateCustomerRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: CustomerSearchQuery): Observable<PaginatedResultDto<Customer[]>> {
    return this.http.get<PaginatedResultDto<Customer[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Customer>> {
    return this.http.get<DataResultDto<Customer>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateCustomerRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  // Private methods
  private buildSearchParams(query: CustomerSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.cliEstado)        params = params.set('cliEstado',        query.cliEstado);
    if (query.cliTipoDocumento) params = params.set('cliTipoDocumento', query.cliTipoDocumento);
    if (query.cliNumDocumento)  params = params.set('cliNumDocumento',  query.cliNumDocumento);

    return params;
  }
}
