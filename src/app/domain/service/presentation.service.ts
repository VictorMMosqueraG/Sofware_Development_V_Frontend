import { Observable } from "rxjs";
import {
  CreatePresentationRequest,
  Presentation,
  PresentationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdatePresentationRequest } from "../models";


export abstract class PresentationService {

  abstract create(request: CreatePresentationRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: PresentationSearchQuery
  ): Observable<PaginatedResultDto<Presentation[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Presentation>>;

  abstract update(
    id: number,
    request: UpdatePresentationRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
