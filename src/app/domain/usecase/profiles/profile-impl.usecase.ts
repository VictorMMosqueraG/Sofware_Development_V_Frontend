import { Injectable } from "@angular/core";
import { ProfileUseCase } from "./profile.usecase";
import { ProfileService } from "../../service/profile.service";
import {
  CreateProfileRequest,
  Profile,
  ProfileSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateProfileRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ProfileImplUseCase extends ProfileUseCase {

  constructor(private profileService: ProfileService) {
    super();
  }

  create(request: CreateProfileRequest): Observable<ResultDto> {
    return this.profileService.create(request);
  }

  getAll(query: ProfileSearchQuery): Observable<PaginatedResultDto<Profile[]>> {
    return this.profileService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Profile>> {
    return this.profileService.getById(id);
  }

  update(id: number, request: UpdateProfileRequest): Observable<ResultDto> {
    return this.profileService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.profileService.delete(id);
  }
}
