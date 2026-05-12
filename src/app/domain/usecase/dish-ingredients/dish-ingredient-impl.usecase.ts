import { Injectable } from "@angular/core";
import { DishIngredientUseCase } from "./dish-ingredient.usecase";
import { DishIngredientService } from "../../service/dish-ingredient.service";
import {
  CreateDishIngredientRequest,
  DishIngredient,
  DishIngredientSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDishIngredientRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class DishIngredientImplUseCase extends DishIngredientUseCase {

  constructor(private dishIngredientService: DishIngredientService) {
    super();
  }

  create(request: CreateDishIngredientRequest): Observable<ResultDto> {
    return this.dishIngredientService.create(request);
  }

  getAll(query: DishIngredientSearchQuery): Observable<PaginatedResultDto<DishIngredient[]>> {
    return this.dishIngredientService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<DishIngredient>> {
    return this.dishIngredientService.getById(id);
  }

  update(id: number, request: UpdateDishIngredientRequest): Observable<ResultDto> {
    return this.dishIngredientService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.dishIngredientService.delete(id);
  }
}
