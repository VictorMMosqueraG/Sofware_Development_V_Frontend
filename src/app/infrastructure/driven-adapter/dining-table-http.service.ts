import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { DiningTableService } from "../../domain/service/dining-table.service";
import {
  CreateDiningTableRequest,
  DiningTable,
  DiningTableSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDiningTableRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class DiningTableHttpService extends DiningTableService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/dining-tables`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateDiningTableRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: DiningTableSearchQuery): Observable<PaginatedResultDto<DiningTable[]>> {
    return this.http.get<PaginatedResultDto<DiningTable[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<DiningTable>> {
    return this.http.get<DataResultDto<DiningTable>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateDiningTableRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: DiningTableSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.estado) params = params.set('estado', query.estado);
    if (query.sedeId) params = params.set('sedeId', query.sedeId);

    return params;
  }
}
