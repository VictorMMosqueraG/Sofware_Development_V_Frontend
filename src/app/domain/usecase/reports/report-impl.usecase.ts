import { Injectable } from "@angular/core";
import { ReportUseCase } from "./report.usecase";
import { ReportService } from "../../service/report.service";
import {
  DataResultDto,
  ReportDetailItem,
  ReportDetailQuery,
  ReportQuery,
  SalesReportResponse,
} from "../../models";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ReportImplUseCase extends ReportUseCase {

  constructor(private reportService: ReportService) {
    super();
  }

  getSalesReport(query: ReportQuery): Observable<DataResultDto<SalesReportResponse>> {
    return this.reportService.getSalesReport(query);
  }

  getReportDetail(query: ReportDetailQuery): Observable<DataResultDto<ReportDetailItem[]>> {
    return this.reportService.getReportDetail(query);
  }

  getOrderDetail(id: number): Observable<DataResultDto<any>> {
    return this.reportService.getOrderDetail(id);
  }

  getCashReceiptDetail(id: number): Observable<DataResultDto<any>> {
    return this.reportService.getCashReceiptDetail(id);
  }
}
