import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { DishIngredientService } from "../../domain/service/dish-ingredient.service";
import {
  CreateDishIngredientRequest,
  DishIngredient,
  DishIngredientSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishIngredientRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class DishIngredientHttpService extends DishIngredientService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/dish-ingredients`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateDishIngredientRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: DishIngredientSearchQuery): Observable<PaginatedResultDto<DishIngredient[]>> {
    return this.http.get<PaginatedResultDto<DishIngredient[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<DishIngredient>> {
    return this.http.get<DataResultDto<DishIngredient>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateDishIngredientRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: DishIngredientSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.plaId) params = params.set('plaId', query.plaId);
    if (query.insId) params = params.set('insId', query.insId);

    return params;
  }
}
