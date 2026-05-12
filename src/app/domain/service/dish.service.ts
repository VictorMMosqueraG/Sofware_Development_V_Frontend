import { Observable } from "rxjs";
import {
  CreateDishRequest,
  Dish,
  DishSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishRequest } from "../models";


export abstract class DishService {

  abstract create(request: CreateDishRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: DishSearchQuery
  ): Observable<PaginatedResultDto<Dish[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Dish>>;

  abstract update(
    id: number,
    request: UpdateDishRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
