import { Observable } from "rxjs";
import {
  CreateStatusTypeRequest,
  StatusType,
  StatusTypeSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateStatusTypeRequest } from "../models";


export abstract class StatusTypeService {

  abstract create(request: CreateStatusTypeRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: StatusTypeSearchQuery
  ): Observable<PaginatedResultDto<StatusType[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<StatusType>>;

  abstract update(
    id: number,
    request: UpdateStatusTypeRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
