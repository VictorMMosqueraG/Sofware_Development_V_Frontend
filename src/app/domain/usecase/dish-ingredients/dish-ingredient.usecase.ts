import { Observable } from "rxjs";
import {
  CreateDishIngredientRequest,
  DishIngredient,
  DishIngredientSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishIngredientRequest }
 from "../../models";


export abstract class DishIngredientUseCase {
  abstract create(
    request: CreateDishIngredientRequest): Observable<ResultDto>;

  abstract getAll(
    query: DishIngredientSearchQuery
  ): Observable<PaginatedResultDto<DishIngredient[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<DishIngredient>>;

  abstract update(
    id: number,
    request: UpdateDishIngredientRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
