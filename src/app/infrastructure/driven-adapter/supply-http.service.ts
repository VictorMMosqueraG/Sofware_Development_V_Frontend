import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { SupplyService } from "../../domain/service/supply.service";
import {
  CreateSupplyRequest,
  Supply,
  SupplySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateSupplyRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class SupplyHttpService extends SupplyService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/supplies`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateSupplyRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: SupplySearchQuery): Observable<PaginatedResultDto<Supply[]>> {
    return this.http.get<PaginatedResultDto<Supply[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Supply>> {
    return this.http.get<DataResultDto<Supply>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateSupplyRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: SupplySearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.insEstado !== undefined) params = params.set('insEstado', query.insEstado);
    if (query.sedeId)                  params = params.set('sedeId',    query.sedeId);

    return params;
  }
}
