import { Injectable } from "@angular/core";
import { OrderDetailUseCase } from "./order-detail.usecase";
import { OrderDetailService } from "../../service/order-detail.service";
import {
  CreateOrderDetailRequest,
  OrderDetail,
  OrderDetailSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateOrderDetailRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class OrderDetailImplUseCase extends OrderDetailUseCase {

  constructor(private orderDetailService: OrderDetailService) {
    super();
  }

  create(request: CreateOrderDetailRequest): Observable<ResultDto> {
    return this.orderDetailService.create(request);
  }

  getAll(query: OrderDetailSearchQuery): Observable<PaginatedResultDto<OrderDetail[]>> {
    return this.orderDetailService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<OrderDetail>> {
    return this.orderDetailService.getById(id);
  }

  update(id: number, request: UpdateOrderDetailRequest): Observable<ResultDto> {
    return this.orderDetailService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.orderDetailService.delete(id);
  }
}
