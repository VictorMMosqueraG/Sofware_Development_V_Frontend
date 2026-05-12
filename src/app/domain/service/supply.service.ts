import { Observable } from "rxjs";
import {
  CreateSupplyRequest,
  Supply,
  SupplySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateSupplyRequest } from "../models";


export abstract class SupplyService {

  abstract create(request: CreateSupplyRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: SupplySearchQuery
  ): Observable<PaginatedResultDto<Supply[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Supply>>;

  abstract update(
    id: number,
    request: UpdateSupplyRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
