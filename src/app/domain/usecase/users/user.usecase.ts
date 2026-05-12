import { Observable } from "rxjs";
import {
  CreateUserRequest,
  User,
  UserSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateUserRequest }
 from "../../models";


export abstract class UserUseCase {
  abstract create(
    request: CreateUserRequest): Observable<ResultDto>;

  abstract getAll(
    query: UserSearchQuery
  ): Observable<PaginatedResultDto<User[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<User>>;

  abstract update(
    id: number,
    request: UpdateUserRequest
  ): Observable<ResultDto>;

  abstract delete(id: number)
    : Observable<ResultDto>;
}
