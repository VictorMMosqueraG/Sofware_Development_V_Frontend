import { Injectable } from "@angular/core";
import { PresentationUseCase } from "./presentation.usecase";
import { PresentationService } from "../../service/presentation.service";
import {
  CreatePresentationRequest,
  Presentation,
  PresentationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePresentationRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class PresentationImplUseCase extends PresentationUseCase {

  constructor(private presentationService: PresentationService) {
    super();
  }

  create(request: CreatePresentationRequest): Observable<ResultDto> {
    return this.presentationService.create(request);
  }

  getAll(query: PresentationSearchQuery): Observable<PaginatedResultDto<Presentation[]>> {
    return this.presentationService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Presentation>> {
    return this.presentationService.getById(id);
  }

  update(id: number, request: UpdatePresentationRequest): Observable<ResultDto> {
    return this.presentationService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.presentationService.delete(id);
  }
}
