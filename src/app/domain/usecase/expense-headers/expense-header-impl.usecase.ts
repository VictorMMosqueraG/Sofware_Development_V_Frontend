import { Injectable } from "@angular/core";
import { ExpenseHeaderUseCase } from "./expense-header.usecase";
import { ExpenseHeaderService } from "../../service/expense-header.service";
import {
  CreateExpenseHeaderRequest,
  ExpenseHeader,
  ExpenseHeaderSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateExpenseHeaderRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ExpenseHeaderImplUseCase extends ExpenseHeaderUseCase {

  constructor(private expenseHeaderService: ExpenseHeaderService) {
    super();
  }

  create(request: CreateExpenseHeaderRequest): Observable<ResultDto> {
    return this.expenseHeaderService.create(request);
  }

  getAll(query: ExpenseHeaderSearchQuery): Observable<PaginatedResultDto<ExpenseHeader[]>> {
    return this.expenseHeaderService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<ExpenseHeader>> {
    return this.expenseHeaderService.getById(id);
  }

  update(id: number, request: UpdateExpenseHeaderRequest): Observable<ResultDto> {
    return this.expenseHeaderService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.expenseHeaderService.delete(id);
  }
}
