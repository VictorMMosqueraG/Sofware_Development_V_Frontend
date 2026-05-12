import { Injectable } from "@angular/core";
import { UserUseCase } from "./user.usecase";
import { UserService } from "../../service/user.service";
import {
  CreateUserRequest,
  User,
  UserSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateUserRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class UserImplUseCase extends UserUseCase {

  constructor(private userService: UserService) {
    super();
  }

  create(request: CreateUserRequest): Observable<ResultDto> {
    return this.userService.create(request);
  }

  getAll(query: UserSearchQuery): Observable<PaginatedResultDto<User[]>> {
    return this.userService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<User>> {
    return this.userService.getById(id);
  }

  update(id: number, request: UpdateUserRequest): Observable<ResultDto> {
    return this.userService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.userService.delete(id);
  }
}
