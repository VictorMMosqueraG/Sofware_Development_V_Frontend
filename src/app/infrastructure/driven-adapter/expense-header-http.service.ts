import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { ExpenseHeaderService } from "../../domain/service/expense-header.service";
import {
  CreateExpenseHeaderRequest,
  ExpenseHeader,
  ExpenseHeaderSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateExpenseHeaderRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class ExpenseHeaderHttpService extends ExpenseHeaderService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/expense-headers`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateExpenseHeaderRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: ExpenseHeaderSearchQuery): Observable<PaginatedResultDto<ExpenseHeader[]>> {
    return this.http.get<PaginatedResultDto<ExpenseHeader[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<ExpenseHeader>> {
    return this.http.get<DataResultDto<ExpenseHeader>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateExpenseHeaderRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: ExpenseHeaderSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.egrEstado) params = params.set('egrEstado', query.egrEstado);
    if (query.sedeId)    params = params.set('sedeId',    query.sedeId);

    return params;
  }
}
