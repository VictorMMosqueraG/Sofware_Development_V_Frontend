import { Observable } from "rxjs";
import {
  CashReceiptDetail,
  CashReceiptDetailSearchQuery,
  CreateCashReceiptDetailRequest,
  DataResultDto,
  PaginatedResultDto,
  UpdateCashReceiptDetailRequest } from "../models";

export abstract class CashReceiptDetailService {
  abstract create(request: CreateCashReceiptDetailRequest): Observable<DataResultDto<CashReceiptDetail>>;
  abstract getAll(query: CashReceiptDetailSearchQuery): Observable<PaginatedResultDto<CashReceiptDetail[]>>;
  abstract getById(id: number): Observable<DataResultDto<CashReceiptDetail>>;
  abstract update(id: number, request: UpdateCashReceiptDetailRequest): Observable<DataResultDto<CashReceiptDetail>>;
  abstract delete(id: number): Observable<DataResultDto<CashReceiptDetail>>;
}
