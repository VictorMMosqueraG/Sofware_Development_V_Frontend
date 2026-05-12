import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { PqrsService } from "../../domain/service/pqrs.service";
import {
  CreatePqrsRequest,
  Pqrs,
  PqrsSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePqrsRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class PqrsHttpService extends PqrsService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/pqrs`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreatePqrsRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: PqrsSearchQuery): Observable<PaginatedResultDto<Pqrs[]>> {
    return this.http.get<PaginatedResultDto<Pqrs[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Pqrs>> {
    return this.http.get<DataResultDto<Pqrs>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdatePqrsRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: PqrsSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.estId)   params = params.set('estId',   query.estId);
    if (query.tpqrsId) params = params.set('tpqrsId', query.tpqrsId);

    return params;
  }
}
