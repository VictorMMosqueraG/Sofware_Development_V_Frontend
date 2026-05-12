import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { DiningAreaService } from "../../domain/service/dining-area.service";
import {
  CreateDiningAreaRequest,
  DiningArea,
  DiningAreaSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDiningAreaRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class DiningAreaHttpService extends DiningAreaService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/dining-areas`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateDiningAreaRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: DiningAreaSearchQuery): Observable<PaginatedResultDto<DiningArea[]>> {
    return this.http.get<PaginatedResultDto<DiningArea[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<DiningArea>> {
    return this.http.get<DataResultDto<DiningArea>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateDiningAreaRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: DiningAreaSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.areaEstado) params = params.set('areaEstado', query.areaEstado);
    if (query.sedeId)     params = params.set('sedeId',     query.sedeId);

    return params;
  }
}
