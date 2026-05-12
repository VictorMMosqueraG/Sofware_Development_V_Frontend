import { Observable } from "rxjs";
import {
  CreateDiningAreaRequest,
  DiningArea,
  DiningAreaSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDiningAreaRequest }
 from "../../models";


export abstract class DiningAreaUseCase {
  abstract create(
    request: CreateDiningAreaRequest): Observable<ResultDto>;

  abstract getAll(
    query: DiningAreaSearchQuery
  ): Observable<PaginatedResultDto<DiningArea[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<DiningArea>>;

  abstract update(
    id: number,
    request: UpdateDiningAreaRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
