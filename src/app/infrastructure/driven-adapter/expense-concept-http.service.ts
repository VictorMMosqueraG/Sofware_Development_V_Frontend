import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { ExpenseConceptService } from "../../domain/service/expense-concept.service";
import {
  CreateExpenseConceptRequest,
  ExpenseConcept,
  ExpenseConceptSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateExpenseConceptRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class ExpenseConceptHttpService extends ExpenseConceptService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/expense-concepts`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateExpenseConceptRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: ExpenseConceptSearchQuery): Observable<PaginatedResultDto<ExpenseConcept[]>> {
    return this.http.get<PaginatedResultDto<ExpenseConcept[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<ExpenseConcept>> {
    return this.http.get<DataResultDto<ExpenseConcept>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateExpenseConceptRequest): Observable<ResultDto> {
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
  private buildSearchParams(query: ExpenseConceptSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.conEstado) params = params.set('conEstado', query.conEstado);

    return params;
  }
}
