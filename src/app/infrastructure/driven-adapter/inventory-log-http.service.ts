import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { InventoryLogService } from "../../domain/service/inventory-log.service";
import {
  CreateInventoryLogRequest,
  InventoryLog,
  InventoryLogSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateInventoryLogRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class InventoryLogHttpService extends InventoryLogService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/inventory-logs`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateInventoryLogRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: InventoryLogSearchQuery): Observable<PaginatedResultDto<InventoryLog[]>> {
    return this.http.get<PaginatedResultDto<InventoryLog[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<InventoryLog>> {
    return this.http.get<DataResultDto<InventoryLog>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateInventoryLogRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: InventoryLogSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.logTipo) params = params.set('logTipo', query.logTipo);
    if (query.insId)   params = params.set('insId',   query.insId);

    return params;
  }
}
