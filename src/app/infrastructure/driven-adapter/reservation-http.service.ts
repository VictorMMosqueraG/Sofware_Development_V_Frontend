import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { ReservationService } from "../../domain/service/reservation.service";
import {
  CreateReservationRequest,
  Reservation,
  ReservationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateReservationRequest,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class ReservationHttpService extends ReservationService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/reservations`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateReservationRequest): Observable<ResultDto> {
    return this.http.post<ResultDto>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: ReservationSearchQuery): Observable<PaginatedResultDto<Reservation[]>> {
    return this.http.get<PaginatedResultDto<Reservation[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<Reservation>> {
    return this.http.get<DataResultDto<Reservation>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateReservationRequest): Observable<ResultDto> {
    return this.http.put<ResultDto>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<ResultDto> {
    return this.http.delete<ResultDto>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  private buildSearchParams(query: ReservationSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.resEstado) params = params.set('resEstado', query.resEstado);
    if (query.sedeId)    params = params.set('sedeId',    query.sedeId);

    return params;
  }
}
