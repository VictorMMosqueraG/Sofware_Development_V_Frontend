import { Observable } from "rxjs";
import {
  CreateDiningTableRequest,
  DiningTable,
  DiningTableSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDiningTableRequest }
 from "../../models";


export abstract class DiningTableUseCase {
  abstract create(
    request: CreateDiningTableRequest): Observable<ResultDto>;

  abstract getAll(
    query: DiningTableSearchQuery
  ): Observable<PaginatedResultDto<DiningTable[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<DiningTable>>;

  abstract update(
    id: number,
    request: UpdateDiningTableRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
