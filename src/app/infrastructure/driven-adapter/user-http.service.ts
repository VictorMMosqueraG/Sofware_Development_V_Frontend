import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { UserService } from "../../domain/service/user.service";
import {
  CreateUserRequest,
  User,
  UserSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateUserRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class UserHttpService extends UserService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/users`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateUserRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: UserSearchQuery): Observable<PaginatedResultDto<User[]>> {
    return this.http.get<PaginatedResultDto<User[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<User>> {
    return this.http.get<DataResultDto<User>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateUserRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: UserSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.usuEstado) params = params.set('usuEstado', query.usuEstado);

    return params;
  }
}
