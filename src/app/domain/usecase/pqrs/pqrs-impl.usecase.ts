import { Injectable } from "@angular/core";
import { PqrsUseCase } from "./pqrs.usecase";
import { PqrsService } from "../../service/pqrs.service";
import {
  CreatePqrsRequest,
  Pqrs,
  PqrsSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePqrsRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class PqrsImplUseCase extends PqrsUseCase {

  constructor(private pqrsService: PqrsService) {
    super();
  }

  create(request: CreatePqrsRequest): Observable<ResultDto> {
    return this.pqrsService.create(request);
  }

  getAll(query: PqrsSearchQuery): Observable<PaginatedResultDto<Pqrs[]>> {
    return this.pqrsService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Pqrs>> {
    return this.pqrsService.getById(id);
  }

  update(id: number, request: UpdatePqrsRequest): Observable<ResultDto> {
    return this.pqrsService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.pqrsService.delete(id);
  }
}
