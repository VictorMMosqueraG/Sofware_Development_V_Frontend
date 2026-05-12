import { Injectable } from "@angular/core";
import { StatusUseCase } from "./status.usecase";
import { StatusService } from "../../service/status.service";
import {
  CreateStatusRequest,
  Status,
  StatusSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateStatusRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class StatusImplUseCase extends StatusUseCase {

  constructor(private statusService: StatusService) {
    super();
  }

  create(request: CreateStatusRequest): Observable<ResultDto> {
    return this.statusService.create(request);
  }

  getAll(query: StatusSearchQuery): Observable<PaginatedResultDto<Status[]>> {
    return this.statusService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Status>> {
    return this.statusService.getById(id);
  }

  update(id: number, request: UpdateStatusRequest): Observable<ResultDto> {
    return this.statusService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.statusService.delete(id);
  }
}
