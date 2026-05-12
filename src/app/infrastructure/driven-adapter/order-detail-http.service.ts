import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { OrderDetailService } from "../../domain/service/order-detail.service";
import {
  CreateOrderDetailRequest,
  OrderDetail,
  OrderDetailSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateOrderDetailRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class OrderDetailHttpService extends OrderDetailService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/order-details`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateOrderDetailRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: OrderDetailSearchQuery): Observable<PaginatedResultDto<OrderDetail[]>> {
    return this.http.get<PaginatedResultDto<OrderDetail[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<OrderDetail>> {
    return this.http.get<DataResultDto<OrderDetail>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateOrderDetailRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: OrderDetailSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.pedId) params = params.set('pedId', query.pedId);
    if (query.plaId) params = params.set('plaId', query.plaId);

    return params;
  }
}
