import { Observable } from "rxjs";
import {
  CreateReservationRequest,
  Reservation,
  ReservationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateReservationRequest }
 from "../../models";


export abstract class ReservationUseCase {
  abstract create(
    request: CreateReservationRequest): Observable<ResultDto>;

  abstract getAll(
    query: ReservationSearchQuery
  ): Observable<PaginatedResultDto<Reservation[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Reservation>>;

  abstract update(
    id: number,
    request: UpdateReservationRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
