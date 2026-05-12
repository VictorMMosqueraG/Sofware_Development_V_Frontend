import { Injectable } from "@angular/core";
import { ConfigurationUseCase } from "./configuration.usecase";
import { ConfigurationService } from "../../service/configuration.service";
import {
  CreateConfigurationRequest,
  Configuration,
  ConfigurationSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateConfigurationRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ConfigurationImplUseCase extends ConfigurationUseCase {

  constructor(private configurationService: ConfigurationService) {
    super();
  }

  create(request: CreateConfigurationRequest): Observable<ResultDto> {
    return this.configurationService.create(request);
  }

  getAll(query: ConfigurationSearchQuery): Observable<PaginatedResultDto<Configuration[]>> {
    return this.configurationService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Configuration>> {
    return this.configurationService.getById(id);
  }

  update(id: number, request: UpdateConfigurationRequest): Observable<ResultDto> {
    return this.configurationService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.configurationService.delete(id);
  }
}
