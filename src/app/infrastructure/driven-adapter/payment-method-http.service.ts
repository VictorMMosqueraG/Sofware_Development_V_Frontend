import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { PaymentMethodService } from "../../domain/service/payment-method.service";
import {
  CreatePaymentMethodRequest,
  PaymentMethod,
  PaymentMethodSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePaymentMethodRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class PaymentMethodHttpService extends PaymentMethodService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/payment-methods`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreatePaymentMethodRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: PaymentMethodSearchQuery): Observable<PaginatedResultDto<PaymentMethod[]>> {
    return this.http.get<PaginatedResultDto<PaymentMethod[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<PaymentMethod>> {
    return this.http.get<DataResultDto<PaymentMethod>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdatePaymentMethodRequest): Observable<ResultDto> {
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
  private buildSearchParams(query: PaymentMethodSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.fpEstado) params = params.set('fpEstado', query.fpEstado);

    return params;
  }
}
