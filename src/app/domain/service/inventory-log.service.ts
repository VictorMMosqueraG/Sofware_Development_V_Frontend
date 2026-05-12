import { Observable } from "rxjs";
import {
  CreateInventoryLogRequest,
  InventoryLog,
  InventoryLogSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateInventoryLogRequest } from "../models";


export abstract class InventoryLogService {

  abstract create(request: CreateInventoryLogRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: InventoryLogSearchQuery
  ): Observable<PaginatedResultDto<InventoryLog[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<InventoryLog>>;

  abstract update(
    id: number,
    request: UpdateInventoryLogRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
