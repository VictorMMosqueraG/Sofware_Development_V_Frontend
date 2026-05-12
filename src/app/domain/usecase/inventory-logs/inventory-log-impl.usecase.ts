import { Injectable } from "@angular/core";
import { InventoryLogUseCase } from "./inventory-log.usecase";
import { InventoryLogService } from "../../service/inventory-log.service";
import {
  CreateInventoryLogRequest,
  InventoryLog,
  InventoryLogSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateInventoryLogRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class InventoryLogImplUseCase extends InventoryLogUseCase {

  constructor(private inventoryLogService: InventoryLogService) {
    super();
  }

  create(request: CreateInventoryLogRequest): Observable<ResultDto> {
    return this.inventoryLogService.create(request);
  }

  getAll(query: InventoryLogSearchQuery): Observable<PaginatedResultDto<InventoryLog[]>> {
    return this.inventoryLogService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<InventoryLog>> {
    return this.inventoryLogService.getById(id);
  }

  update(id: number, request: UpdateInventoryLogRequest): Observable<ResultDto> {
    return this.inventoryLogService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.inventoryLogService.delete(id);
  }
}
