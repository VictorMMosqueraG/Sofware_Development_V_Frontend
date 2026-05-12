import { Observable } from "rxjs";
import {
  CreateExpenseHeaderRequest,
  ExpenseHeader,
  ExpenseHeaderSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateExpenseHeaderRequest } from "../models";


export abstract class ExpenseHeaderService {

  abstract create(request: CreateExpenseHeaderRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: ExpenseHeaderSearchQuery
  ): Observable<PaginatedResultDto<ExpenseHeader[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<ExpenseHeader>>;

  abstract update(
    id: number,
    request: UpdateExpenseHeaderRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
