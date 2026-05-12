import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { ProfileService } from "../../domain/service/profile.service";
import {
  CreateProfileRequest,
  Profile,
  ProfileSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateProfileRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class ProfileHttpService extends ProfileService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/profiles`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateProfileRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: ProfileSearchQuery): Observable<PaginatedResultDto<Profile[]>> {
    return this.http.get<PaginatedResultDto<Profile[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Profile>> {
    return this.http.get<DataResultDto<Profile>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateProfileRequest): Observable<ResultDto> {
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
  private buildSearchParams(query: ProfileSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.perfEstado) params = params.set('perfEstado', query.perfEstado);

    return params;
  }
}
