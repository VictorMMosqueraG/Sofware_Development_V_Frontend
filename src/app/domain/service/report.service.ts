import { Observable } from "rxjs";
import {
  DataResultDto,
  ReportDetailItem,
  ReportDetailQuery,
  ReportQuery,
  SalesReportResponse,
} from "../models";

export abstract class ReportService {

  abstract getSalesReport(query: ReportQuery):
    Observable<DataResultDto<SalesReportResponse>>;

  abstract getReportDetail(query: ReportDetailQuery):
    Observable<DataResultDto<ReportDetailItem[]>>;

  abstract getOrderDetail(id: number):
    Observable<DataResultDto<any>>;

  abstract getCashReceiptDetail(id: number):
    Observable<DataResultDto<any>>;
}
