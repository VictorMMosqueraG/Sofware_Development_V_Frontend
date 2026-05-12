import { Observable } from "rxjs";
import {
  CreateExpenseConceptRequest,
  ExpenseConcept,
  ExpenseConceptSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateExpenseConceptRequest } from "../models";


export abstract class ExpenseConceptService {

  abstract create(request: CreateExpenseConceptRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: ExpenseConceptSearchQuery
  ): Observable<PaginatedResultDto<ExpenseConcept[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<ExpenseConcept>>;

  abstract update(
    id: number,
    request: UpdateExpenseConceptRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
