import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { BranchService } from "../../domain/service/branch.service";
import {
  CreateBranchRequest,
  Branch,
  BranchSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateBranchRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class BranchHttpService extends BranchService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/branches`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateBranchRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: BranchSearchQuery): Observable<PaginatedResultDto<Branch[]>> {
    return this.http.get<PaginatedResultDto<Branch[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Branch>> {
    return this.http.get<DataResultDto<Branch>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateBranchRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: BranchSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.sedeEstado) params = params.set('sedeEstado', query.sedeEstado);

    return params;
  }
}
