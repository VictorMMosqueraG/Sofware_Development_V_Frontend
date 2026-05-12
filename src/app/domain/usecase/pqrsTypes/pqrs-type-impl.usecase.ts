import { Injectable } from "@angular/core";
import { PqrsTypeUseCase } from "./pqrs-type.usecase";
import { PqrsTypeService } from "../../service/pqrs-type.service";
import {
  CreatePqrsTypeRequest,
  PqrsType,
  PqrsTypeSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePqrsTypeRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class PqrsTypeImplUseCase extends PqrsTypeUseCase {

  constructor(private pqrsTypeService: PqrsTypeService) {
    super();
  }

  create(request: CreatePqrsTypeRequest): Observable<ResultDto> {
    return this.pqrsTypeService.create(request);
  }

  getAll(query: PqrsTypeSearchQuery): Observable<PaginatedResultDto<PqrsType[]>> {
    return this.pqrsTypeService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<PqrsType>> {
    return this.pqrsTypeService.getById(id);
  }

  update(id: number, request: UpdatePqrsTypeRequest): Observable<ResultDto> {
    return this.pqrsTypeService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.pqrsTypeService.delete(id);
  }
}
