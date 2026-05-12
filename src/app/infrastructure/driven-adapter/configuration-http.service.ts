import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { ConfigurationService } from "../../domain/service/configuration.service";
import {
  CreateConfigurationRequest,
  Configuration,
  ConfigurationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateConfigurationRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class ConfigurationHttpService extends ConfigurationService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/configurations`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateConfigurationRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: ConfigurationSearchQuery): Observable<PaginatedResultDto<Configuration[]>> {
    return this.http.get<PaginatedResultDto<Configuration[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Configuration>> {
    return this.http.get<DataResultDto<Configuration>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateConfigurationRequest): Observable<ResultDto> {
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
  private buildSearchParams(query: ConfigurationSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    return params;
  }
}
