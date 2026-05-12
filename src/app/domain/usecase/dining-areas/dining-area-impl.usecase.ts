import { Injectable } from "@angular/core";
import { DiningAreaUseCase } from "./dining-area.usecase";
import { DiningAreaService } from "../../service/dining-area.service";
import {
  CreateDiningAreaRequest,
  DiningArea,
  DiningAreaSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateDiningAreaRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class DiningAreaImplUseCase extends DiningAreaUseCase {

  constructor(private diningAreaService: DiningAreaService) {
    super();
  }

  create(request: CreateDiningAreaRequest): Observable<ResultDto> {
    return this.diningAreaService.create(request);
  }

  getAll(query: DiningAreaSearchQuery): Observable<PaginatedResultDto<DiningArea[]>> {
    return this.diningAreaService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<DiningArea>> {
    return this.diningAreaService.getById(id);
  }

  update(id: number, request: UpdateDiningAreaRequest): Observable<ResultDto> {
    return this.diningAreaService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.diningAreaService.delete(id);
  }
}
