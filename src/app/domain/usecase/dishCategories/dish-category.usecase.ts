import { Observable } from "rxjs";
import {
  CreateDishCategoryRequest,
  DishCategory,
  DishCategorySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishCategoryRequest }
 from "../../models";


export abstract class DishCategoryUseCase {
  abstract create(
    request: CreateDishCategoryRequest): Observable<ResultDto>;

  abstract getAll(
    query: DishCategorySearchQuery
  ): Observable<PaginatedResultDto<DishCategory[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<DishCategory>>;

  abstract update(
    id: number,
    request: UpdateDishCategoryRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
