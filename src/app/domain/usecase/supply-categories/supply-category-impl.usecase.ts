import { Injectable } from "@angular/core";
import { SupplyCategoryUseCase } from "./supply-category.usecase";
import { SupplyCategoryService } from "../../service/supply-category.service";
import {
  CreateSupplyCategoryRequest,
  SupplyCategory,
  SupplyCategorySearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateSupplyCategoryRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class SupplyCategoryImplUseCase extends SupplyCategoryUseCase {

  constructor(private supplyCategoryService: SupplyCategoryService) {
    super();
  }

  create(request: CreateSupplyCategoryRequest): Observable<ResultDto> {
    return this.supplyCategoryService.create(request);
  }

  getAll(query: SupplyCategorySearchQuery): Observable<PaginatedResultDto<SupplyCategory[]>> {
    return this.supplyCategoryService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<SupplyCategory>> {
    return this.supplyCategoryService.getById(id);
  }

  update(id: number, request: UpdateSupplyCategoryRequest): Observable<ResultDto> {
    return this.supplyCategoryService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.supplyCategoryService.delete(id);
  }
}
