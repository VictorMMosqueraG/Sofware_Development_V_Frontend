import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { DishService } from "../../domain/service/dish.service";
import {
  CreateDishRequest,
  Dish,
  DishSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class DishHttpService extends DishService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/dishes`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateDishRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: DishSearchQuery): Observable<PaginatedResultDto<Dish[]>> {
    return this.http.get<PaginatedResultDto<Dish[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Dish>> {
    return this.http.get<DataResultDto<Dish>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateDishRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: DishSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.estId) params = params.set('estId', query.estId);

    return params;
  }
}
