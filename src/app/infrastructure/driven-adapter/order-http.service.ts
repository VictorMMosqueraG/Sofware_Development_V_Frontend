import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { OrderService } from "../../domain/service/order.service";
import {
  CreateOrderRequest,
  Order,
  OrderSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateOrderRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class OrderHttpService extends OrderService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/pedidos`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateOrderRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: OrderSearchQuery): Observable<PaginatedResultDto<Order[]>> {
    return this.http.get<PaginatedResultDto<Order[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Order>> {
    return this.http.get<DataResultDto<Order>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateOrderRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: OrderSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.estId)  params = params.set('estId',  query.estId);
    if (query.sedeId) params = params.set('sedeId', query.sedeId);

    return params;
  }
}
