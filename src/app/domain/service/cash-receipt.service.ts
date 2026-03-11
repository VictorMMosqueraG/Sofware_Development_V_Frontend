import { Observable } from "rxjs";
import {
  CashReceipt,
  CashReceiptSearchQuery,
  CreateCashReceiptRequest,
  DataResultDto,
  PaginatedResultDto,
  UpdateCashReceiptRequest } from "../models";

export abstract class CashReceiptService {
  abstract create(request: CreateCashReceiptRequest): Observable<DataResultDto<CashReceipt>>;
  abstract getAll(query: CashReceiptSearchQuery): Observable<PaginatedResultDto<CashReceipt[]>>;
  abstract getById(id: number): Observable<DataResultDto<CashReceipt>>;
  abstract update(id: number, request: UpdateCashReceiptRequest): Observable<DataResultDto<CashReceipt>>;
  abstract delete(id: number): Observable<DataResultDto<CashReceipt>>;
}
