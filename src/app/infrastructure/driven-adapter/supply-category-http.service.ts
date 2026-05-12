import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { SupplyCategoryService } from "../../domain/service/supply-category.service";
import {
  CreateSupplyCategoryRequest,
  SupplyCategory,
  SupplyCategorySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateSupplyCategoryRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class SupplyCategoryHttpService extends SupplyCategoryService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/supply-categories`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateSupplyCategoryRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: SupplyCategorySearchQuery): Observable<PaginatedResultDto<SupplyCategory[]>> {
    return this.http.get<PaginatedResultDto<SupplyCategory[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<SupplyCategory>> {
    return this.http.get<DataResultDto<SupplyCategory>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateSupplyCategoryRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: SupplyCategorySearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.cinsEstado !== undefined && query.cinsEstado !== null) {
      params = params.set('cinsEstado', query.cinsEstado);
    }

    return params;
  }
}
