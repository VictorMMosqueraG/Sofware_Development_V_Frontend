import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { PresentationService } from "../../domain/service/presentation.service";
import {
  CreatePresentationRequest,
  Presentation,
  PresentationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePresentationRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class PresentationHttpService extends PresentationService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/presentations`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreatePresentationRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: PresentationSearchQuery): Observable<PaginatedResultDto<Presentation[]>> {
    return this.http.get<PaginatedResultDto<Presentation[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Presentation>> {
    return this.http.get<DataResultDto<Presentation>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdatePresentationRequest): Observable<ResultDto> {
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
  private buildSearchParams(query: PresentationSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.presEstado) params = params.set('presEstado', query.presEstado);

    return params;
  }
}
