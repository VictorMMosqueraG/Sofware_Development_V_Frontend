import { Observable } from "rxjs";
import {
  CreateSupplyCategoryRequest,
  SupplyCategory,
  SupplyCategorySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateSupplyCategoryRequest } from "../models";


export abstract class SupplyCategoryService {

  abstract create(request: CreateSupplyCategoryRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: SupplyCategorySearchQuery
  ): Observable<PaginatedResultDto<SupplyCategory[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<SupplyCategory>>;

  abstract update(
    id: number,
    request: UpdateSupplyCategoryRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
