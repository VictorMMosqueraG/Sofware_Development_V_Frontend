import { Injectable } from "@angular/core";
import { ReservationUseCase } from "./reservation.usecase";
import { ReservationService } from "../../service/reservation.service";
import {
  CreateReservationRequest,
  Reservation,
  ReservationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateReservationRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ReservationImplUseCase extends ReservationUseCase {

  constructor(private reservationService: ReservationService) {
    super();
  }

  create(request: CreateReservationRequest): Observable<ResultDto> {
    return this.reservationService.create(request);
  }

  getAll(query: ReservationSearchQuery): Observable<PaginatedResultDto<Reservation[]>> {
    return this.reservationService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Reservation>> {
    return this.reservationService.getById(id);
  }

  update(id: number, request: UpdateReservationRequest): Observable<ResultDto> {
    return this.reservationService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.reservationService.delete(id);
  }
}
