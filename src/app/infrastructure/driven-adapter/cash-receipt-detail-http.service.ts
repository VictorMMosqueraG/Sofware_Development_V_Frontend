import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { CashReceiptDetailService } from '../../domain/service/cash-receipt-detail.service';
import { DEFAULT_HEADERS } from '../config/http.config';
import {
  CashReceiptDetail,
  CashReceiptDetailSearchQuery,
  CreateCashReceiptDetailRequest,
  DataResultDto,
  PaginatedResultDto,
  UpdateCashReceiptDetailRequest } from '../../domain/models';

@Injectable({ providedIn: 'root' })
export class CashReceiptDetailHttpService extends CashReceiptDetailService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/cash-receipt-detail`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  create(request: CreateCashReceiptDetailRequest): Observable<DataResultDto<CashReceiptDetail>> {
    return this.http.post<DataResultDto<CashReceiptDetail>>(this.baseUrl, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  getAll(query: CashReceiptDetailSearchQuery): Observable<PaginatedResultDto<CashReceiptDetail[]>> {
    return this.http.get<PaginatedResultDto<CashReceiptDetail[]>>(this.baseUrl, {
      headers: DEFAULT_HEADERS,
      params: this.buildSearchParams(query),
    });
  }

  getById(id: number): Observable<DataResultDto<CashReceiptDetail>> {
    return this.http.get<DataResultDto<CashReceiptDetail>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  update(id: number, request: UpdateCashReceiptDetailRequest): Observable<DataResultDto<CashReceiptDetail>> {
    return this.http.put<DataResultDto<CashReceiptDetail>>(`${this.baseUrl}/${id}`, request, {
      headers: DEFAULT_HEADERS,
    });
  }

  delete(id: number): Observable<DataResultDto<CashReceiptDetail>> {
    return this.http.delete<DataResultDto<CashReceiptDetail>>(`${this.baseUrl}/${id}`, {
      headers: DEFAULT_HEADERS,
    });
  }

  // ── Private ──────────────────────────────────────────────
  private buildSearchParams(query: CashReceiptDetailSearchQuery): HttpParams {
    const { page, pageSize, sort, order } = query.pagination;

    let params = new HttpParams()
      .set('page',     page)
      .set('pageSize', pageSize)
      .set('sort',     sort)
      .set('order',    order);

    if (query.rcNum) params = params.set('rcNum', query.rcNum);
    if (query.plaId) params = params.set('plaId', query.plaId);

    return params;
  }
}
