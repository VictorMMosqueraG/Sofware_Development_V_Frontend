import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { DishCategoryService } from "../../domain/service/dish-category.service";
import {
  CreateDishCategoryRequest,
  DishCategory,
  DishCategorySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishCategoryRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class DishCategoryHttpService extends DishCategoryService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/dish-categories`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateDishCategoryRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: DishCategorySearchQuery): Observable<PaginatedResultDto<DishCategory[]>> {
    return this.http.get<PaginatedResultDto<DishCategory[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<DishCategory>> {
    return this.http.get<DataResultDto<DishCategory>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateDishCategoryRequest): Observable<ResultDto> {
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
  private buildSearchParams(query: DishCategorySearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.catEstado) params = params.set('catEstado', query.catEstado);

    return params;
  }
}
