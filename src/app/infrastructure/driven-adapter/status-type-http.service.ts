import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { StatusTypeService } from "../../domain/service/status-type.service";
import {
  CreateStatusTypeRequest,
  StatusType,
  StatusTypeSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateStatusTypeRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class StatusTypeHttpService extends StatusTypeService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/status-types`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateStatusTypeRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: StatusTypeSearchQuery): Observable<PaginatedResultDto<StatusType[]>> {
    return this.http.get<PaginatedResultDto<StatusType[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<StatusType>> {
    return this.http.get<DataResultDto<StatusType>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateStatusTypeRequest): Observable<ResultDto> {
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
  private buildSearchParams(query: StatusTypeSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.tesEstado) params = params.set('tesEstado', query.tesEstado);

    return params;
  }
}
