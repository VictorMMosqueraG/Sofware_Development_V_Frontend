import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { CashReceiptService } from '../../domain/service/cash-receipt.service';
import { DEFAULT_HEADERS } from '../config/http.config';
import {
  CashReceipt,
  CashReceiptSearchQuery,
  CreateCashReceiptRequest,
  DataResultDto,
  PaginatedResultDto,
  UpdateCashReceiptRequest } from '../../domain/models';

@Injectable({ providedIn: 'root' })
export class CashReceiptHttpService extends CashReceiptService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/cash-receipt`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateCashReceiptRequest): Observable<DataResultDto<CashReceipt>> {
    return this.http.post<DataResultDto<CashReceipt>>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: CashReceiptSearchQuery): Observable<PaginatedResultDto<CashReceipt[]>> {
    return this.http.get<PaginatedResultDto<CashReceipt[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<CashReceipt>> {
    return this.http.get<DataResultDto<CashReceipt>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateCashReceiptRequest): Observable<DataResultDto<CashReceipt>> {
    return this.http.put<DataResultDto<CashReceipt>>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<DataResultDto<CashReceipt>> {
    return this.http.delete<DataResultDto<CashReceipt>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  // ── Private ──────────────────────────────────────────────
  private buildSearchParams(query: CashReceiptSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.rcEstado) params = params.set('rcEstado', query.rcEstado);
    if (query.cliId)    params = params.set('cliId',    query.cliId);
    if (query.usuId)    params = params.set('usuId',    query.usuId);

    return params;
  }
}
