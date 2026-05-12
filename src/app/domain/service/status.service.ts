import { Observable } from "rxjs";
import {
  CreateStatusRequest,
  Status,
  StatusSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateStatusRequest } from "../models";


export abstract class StatusService {

  abstract create(request: CreateStatusRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: StatusSearchQuery
  ): Observable<PaginatedResultDto<Status[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Status>>;

  abstract update(
    id: number,
    request: UpdateStatusRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
