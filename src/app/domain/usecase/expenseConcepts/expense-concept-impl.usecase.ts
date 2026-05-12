import { Injectable } from "@angular/core";
import { ExpenseConceptUseCase } from "./expense-concept.usecase";
import { ExpenseConceptService } from "../../service/expense-concept.service";
import {
  CreateExpenseConceptRequest,
  ExpenseConcept,
  ExpenseConceptSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateExpenseConceptRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ExpenseConceptImplUseCase extends ExpenseConceptUseCase {

  constructor(private expenseConceptService: ExpenseConceptService) {
    super();
  }

  create(request: CreateExpenseConceptRequest): Observable<ResultDto> {
    return this.expenseConceptService.create(request);
  }

  getAll(query: ExpenseConceptSearchQuery): Observable<PaginatedResultDto<ExpenseConcept[]>> {
    return this.expenseConceptService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<ExpenseConcept>> {
    return this.expenseConceptService.getById(id);
  }

  update(id: number, request: UpdateExpenseConceptRequest): Observable<ResultDto> {
    return this.expenseConceptService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.expenseConceptService.delete(id);
  }
}
