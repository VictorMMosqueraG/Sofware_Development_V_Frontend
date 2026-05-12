import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { StatusService } from "../../domain/service/status.service";
import {
  CreateStatusRequest,
  Status,
  StatusSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateStatusRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class StatusHttpService extends StatusService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/statuses`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateStatusRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: StatusSearchQuery): Observable<PaginatedResultDto<Status[]>> {
    return this.http.get<PaginatedResultDto<Status[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Status>> {
    return this.http.get<DataResultDto<Status>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateStatusRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: StatusSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.estEstado) params = params.set('estEstado', query.estEstado);
    if (query.tesId)     params = params.set('tesId',     query.tesId);

    return params;
  }
}
