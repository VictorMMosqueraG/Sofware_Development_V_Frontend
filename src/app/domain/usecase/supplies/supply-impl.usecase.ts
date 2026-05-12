import { Injectable } from "@angular/core";
import { SupplyUseCase } from "./supply.usecase";
import { SupplyService } from "../../service/supply.service";
import {
  CreateSupplyRequest,
  Supply,
  SupplySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateSupplyRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class SupplyImplUseCase extends SupplyUseCase {

  constructor(private supplyService: SupplyService) {
    super();
  }

  create(request: CreateSupplyRequest): Observable<ResultDto> {
    return this.supplyService.create(request);
  }

  getAll(query: SupplySearchQuery): Observable<PaginatedResultDto<Supply[]>> {
    return this.supplyService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Supply>> {
    return this.supplyService.getById(id);
  }

  update(id: number, request: UpdateSupplyRequest): Observable<ResultDto> {
    return this.supplyService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.supplyService.delete(id);
  }
}
