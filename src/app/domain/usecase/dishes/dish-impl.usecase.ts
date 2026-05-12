import { Injectable } from "@angular/core";
import { DishUseCase } from "./dish.usecase";
import { DishService } from "../../service/dish.service";
import {
  CreateDishRequest,
  Dish,
  DishSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class DishImplUseCase extends DishUseCase {

  constructor(private dishService: DishService) {
    super();
  }

  create(request: CreateDishRequest): Observable<ResultDto> {
    return this.dishService.create(request);
  }

  getAll(query: DishSearchQuery): Observable<PaginatedResultDto<Dish[]>> {
    return this.dishService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Dish>> {
    return this.dishService.getById(id);
  }

  update(id: number, request: UpdateDishRequest): Observable<ResultDto> {
    return this.dishService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.dishService.delete(id);
  }
}
