import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { PqrsTypeService } from "../../domain/service/pqrs-type.service";
import {
  CreatePqrsTypeRequest,
  PqrsType,
  PqrsTypeSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePqrsTypeRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class PqrsTypeHttpService extends PqrsTypeService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/pqrs-types`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreatePqrsTypeRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: PqrsTypeSearchQuery): Observable<PaginatedResultDto<PqrsType[]>> {
    return this.http.get<PaginatedResultDto<PqrsType[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<PqrsType>> {
    return this.http.get<DataResultDto<PqrsType>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdatePqrsTypeRequest): Observable<ResultDto> {
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
  private buildSearchParams(query: PqrsTypeSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.tpqrsEstado) params = params.set('tpqrsEstado', query.tpqrsEstado);

    return params;
  }
}
