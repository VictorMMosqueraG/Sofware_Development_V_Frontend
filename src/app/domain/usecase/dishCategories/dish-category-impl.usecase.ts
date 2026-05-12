import { Injectable } from "@angular/core";
import { DishCategoryUseCase } from "./dish-category.usecase";
import { DishCategoryService } from "../../service/dish-category.service";
import {
  CreateDishCategoryRequest,
  DishCategory,
  DishCategorySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishCategoryRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class DishCategoryImplUseCase extends DishCategoryUseCase {

  constructor(private dishCategoryService: DishCategoryService) {
    super();
  }

  create(request: CreateDishCategoryRequest): Observable<ResultDto> {
    return this.dishCategoryService.create(request);
  }

  getAll(query: DishCategorySearchQuery): Observable<PaginatedResultDto<DishCategory[]>> {
    return this.dishCategoryService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<DishCategory>> {
    return this.dishCategoryService.getById(id);
  }

  update(id: number, request: UpdateDishCategoryRequest): Observable<ResultDto> {
    return this.dishCategoryService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.dishCategoryService.delete(id);
  }
}
