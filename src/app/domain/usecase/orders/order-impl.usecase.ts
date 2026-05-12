import { Injectable } from "@angular/core";
import { OrderUseCase } from "./order.usecase";
import { OrderService } from "../../service/order.service";
import {
  CreateOrderRequest,
  Order,
  OrderSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateOrderRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class OrderImplUseCase extends OrderUseCase {

  constructor(private orderService: OrderService) {
    super();
  }

  create(request: CreateOrderRequest): Observable<ResultDto> {
    return this.orderService.create(request);
  }

  getAll(query: OrderSearchQuery): Observable<PaginatedResultDto<Order[]>> {
    return this.orderService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Order>> {
    return this.orderService.getById(id);
  }

  update(id: number, request: UpdateOrderRequest): Observable<ResultDto> {
    return this.orderService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.orderService.delete(id);
  }
}
