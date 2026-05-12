import { Observable } from "rxjs";
import {
  CreateConfigurationRequest,
  Configuration,
  ConfigurationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateConfigurationRequest } from "../models";


export abstract class ConfigurationService {

  abstract create(request: CreateConfigurationRequest)
    : Observable<ResultDto>;

  abstract getAll(
    query: ConfigurationSearchQuery
  ): Observable<PaginatedResultDto<Configuration[]>>;

  abstract getById(id: number):
    Observable<DataResultDto<Configuration>>;

  abstract update(
    id: number,
    request: UpdateConfigurationRequest
  ): Observable<ResultDto>;

  abstract delete(id: number):
    Observable<ResultDto>;
}
