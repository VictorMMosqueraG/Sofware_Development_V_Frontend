import { Observable } from "rxjs";
import {
  CreatePqrsRequest,
  Pqrs,
  PqrsSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePqrsRequest }
 from "../../models";


export abstract class PqrsUseCase {
  abstract create(
    request: CreatePqrsRequest): Observable<ResultDto>;

  abstract getAll(
    query: PqrsSearchQuery
  ): Observable<PaginatedResultDto<Pqrs[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Pqrs>>;

  abstract update(
    id: number,
    request: UpdatePqrsRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
