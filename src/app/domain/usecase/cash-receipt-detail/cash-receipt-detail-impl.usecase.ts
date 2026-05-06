import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CashReceiptDetailUseCase } from './cash-receipt-detail.usecase';
import { CashReceiptDetailService } from '../../service/cash-receipt-detail.service';
import {
  CashReceiptDetail,
  CashReceiptDetailSearchQuery,
  CreateCashReceiptDetailRequest,
  DataResultDto,
  PaginatedResultDto,
  UpdateCashReceiptDetailRequest } from '../../models';

@Injectable({ providedIn: 'root' })
export class CashReceiptDetailImplUseCase extends CashReceiptDetailUseCase {

  constructor(private readonly service: CashReceiptDetailService) {
    super();
  }

  create(request: CreateCashReceiptDetailRequest): Observable<DataResultDto<CashReceiptDetail>> {
    return this.service.create(request);
  }

  getAll(query: CashReceiptDetailSearchQuery): Observable<PaginatedResultDto<CashReceiptDetail[]>> {
    return this.service.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<CashReceiptDetail>> {
    return this.service.getById(id);
  }

  update(id: number, request: UpdateCashReceiptDetailRequest): Observable<DataResultDto<CashReceiptDetail>> {
    return this.service.update(id, request);
  }

  delete(id: number): Observable<DataResultDto<CashReceiptDetail>> {
    return this.service.delete(id);
  }
}
