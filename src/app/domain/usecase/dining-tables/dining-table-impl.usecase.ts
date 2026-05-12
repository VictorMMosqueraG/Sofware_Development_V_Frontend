import { Injectable } from "@angular/core";
import { DiningTableUseCase } from "./dining-table.usecase";
import { DiningTableService } from "../../service/dining-table.service";
import {
  CreateDiningTableRequest,
  DiningTable,
  DiningTableSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDiningTableRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class DiningTableImplUseCase extends DiningTableUseCase {

  constructor(private diningTableService: DiningTableService) {
    super();
  }

  create(request: CreateDiningTableRequest): Observable<ResultDto> {
    return this.diningTableService.create(request);
  }

  getAll(query: DiningTableSearchQuery): Observable<PaginatedResultDto<DiningTable[]>> {
    return this.diningTableService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<DiningTable>> {
    return this.diningTableService.getById(id);
  }

  update(id: number, request: UpdateDiningTableRequest): Observable<ResultDto> {
    return this.diningTableService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.diningTableService.delete(id);
  }
}
