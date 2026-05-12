import { Observable } from "rxjs";
import {
  CreateProfileRequest,
  Profile,
  ProfileSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateProfileRequest } from "../models";


export abstract class ProfileService {

  abstract create(request: CreateProfileRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: ProfileSearchQuery
  ): Observable<PaginatedResultDto<Profile[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Profile>>;

  abstract update(
    id: number,
    request: UpdateProfileRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
