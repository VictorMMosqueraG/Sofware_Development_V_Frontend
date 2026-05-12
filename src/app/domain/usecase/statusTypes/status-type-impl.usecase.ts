import { Injectable } from "@angular/core";
import { StatusTypeUseCase } from "./status-type.usecase";
import { StatusTypeService } from "../../service/status-type.service";
import {
  CreateStatusTypeRequest,
  StatusType,
  StatusTypeSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateStatusTypeRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class StatusTypeImplUseCase extends StatusTypeUseCase {

  constructor(private statusTypeService: StatusTypeService) {
    super();
  }

  create(request: CreateStatusTypeRequest): Observable<ResultDto> {
    return this.statusTypeService.create(request);
  }

  getAll(query: StatusTypeSearchQuery): Observable<PaginatedResultDto<StatusType[]>> {
    return this.statusTypeService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<StatusType>> {
    return this.statusTypeService.getById(id);
  }

  update(id: number, request: UpdateStatusTypeRequest): Observable<ResultDto> {
    return this.statusTypeService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.statusTypeService.delete(id);
  }
}
