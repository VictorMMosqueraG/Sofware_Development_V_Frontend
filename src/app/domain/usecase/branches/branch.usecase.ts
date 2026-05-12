import { Observable } from "rxjs";
import {
  CreateBranchRequest,
  Branch,
  BranchSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateBranchRequest }
 from "../../models";


export abstract class BranchUseCase {
  abstract create(
    request: CreateBranchRequest): Observable<ResultDto>;

  abstract getAll(
    query: BranchSearchQuery
  ): Observable<PaginatedResultDto<Branch[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Branch>>;

  abstract update(
    id: number,
    request: UpdateBranchRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
