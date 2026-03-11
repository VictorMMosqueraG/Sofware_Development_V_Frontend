import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CashReceiptUseCase } from './cash-receipt.usecase';
import { CashReceiptService } from '../../service/cash-receipt.service';
import {
  CashReceipt,
  CashReceiptSearchQuery,
  CreateCashReceiptRequest,
  DataResultDto,
  PaginatedResultDto,
  UpdateCashReceiptRequest } from '../../models';

@Injectable({ providedIn: 'root' })
export class CashReceiptImplUseCase extends CashReceiptUseCase {

  constructor(private readonly cashReceiptService: CashReceiptService) {
    super();
  }

  create(request: CreateCashReceiptRequest): Observable<DataResultDto<CashReceipt>> {
    return this.cashReceiptService.create(request);
  }

  getAll(query: CashReceiptSearchQuery): Observable<PaginatedResultDto<CashReceipt[]>> {
    return this.cashReceiptService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<CashReceipt>> {
    return this.cashReceiptService.getById(id);
  }

  update(id: number, request: UpdateCashReceiptRequest): Observable<DataResultDto<CashReceipt>> {
    return this.cashReceiptService.update(id, request);
  }

  delete(id: number): Observable<DataResultDto<CashReceipt>> {
    return this.cashReceiptService.delete(id);
  }
}
