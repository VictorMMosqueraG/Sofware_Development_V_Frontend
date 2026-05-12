import { Observable } from "rxjs";
import {
  CreateOrderDetailRequest,
  OrderDetail,
  OrderDetailSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateOrderDetailRequest } from "../models";


export abstract class OrderDetailService {

  abstract create(request: CreateOrderDetailRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: OrderDetailSearchQuery
  ): Observable<PaginatedResultDto<OrderDetail[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<OrderDetail>>;

  abstract update(
    id: number,
    request: UpdateOrderDetailRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
