import { Observable } from "rxjs";
import {
  CreatePqrsTypeRequest,
  PqrsType,
  PqrsTypeSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePqrsTypeRequest }
 from "../../models";


export abstract class PqrsTypeUseCase {
  abstract create(
    request: CreatePqrsTypeRequest): Observable<ResultDto>;

  abstract getAll(
    query: PqrsTypeSearchQuery
  ): Observable<PaginatedResultDto<PqrsType[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<PqrsType>>;

  abstract update(
    id: number,
    request: UpdatePqrsTypeRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
