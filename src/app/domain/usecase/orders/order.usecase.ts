import { Observable } from "rxjs";
import {
  CreateOrderRequest,
  Order,
  OrderSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateOrderRequest }
 from "../../models";


export abstract class OrderUseCase {
  abstract create(
    request: CreateOrderRequest): Observable<ResultDto>;

  abstract getAll(
    query: OrderSearchQuery
  ): Observable<PaginatedResultDto<Order[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Order>>;

  abstract update(
    id: number,
    request: UpdateOrderRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
