import { Injectable } from "@angular/core";
import { BranchUseCase } from "./branch.usecase";
import { BranchService } from "../../service/branch.service";
import {
  CreateBranchRequest,
  Branch,
  BranchSearchQuery,
  DataResultDto,
  PaginatedResultDto,
  ResultDto,
  UpdateBranchRequest
} from "../../models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class BranchImplUseCase extends BranchUseCase {

  constructor(private branchService: BranchService) {
    super();
  }

  create(request: CreateBranchRequest): Observable<ResultDto> {
    return this.branchService.create(request);
  }

  getAll(query: BranchSearchQuery): Observable<PaginatedResultDto<Branch[]>> {
    return this.branchService.getAll(query);
  }

  getById(id: number): Observable<DataResultDto<Branch>> {
    return this.branchService.getById(id);
  }

  update(id: number, request: UpdateBranchRequest): Observable<ResultDto> {
    return this.branchService.update(id, request);
  }

  delete(id: number): Observable<ResultDto> {
    return this.branchService.delete(id);
  }
}
