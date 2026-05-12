import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments";
import { ReportService } from "../../domain/service/report.service";
import {
  DataResultDto,
  ReportDetailItem,
  ReportDetailQuery,
  ReportQuery,
  SalesReportResponse,
} from "../../domain/models";
import { DEFAULT_HEADERS } from "../config/http.config";

@Injectable({ providedIn: 'root' })
export class ReportHttpService extends ReportService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/reportes`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  getSalesReport(query: ReportQuery): Observable<DataResultDto<SalesReportResponse>> {
    return this.http.get<DataResultDto<SalesReportResponse>>(
      `${this.baseUrl}/ventas-platos`,
      {
        headers: DEFAULT_HEADERS,
        params: this.buildReportParams(query),
      }
    );
  }

  getReportDetail(query: ReportDetailQuery): Observable<DataResultDto<ReportDetailItem[]>> {
    return this.http.post<DataResultDto<ReportDetailItem[]>>(
      `${this.baseUrl}/ventas-platos/detalle`,
      query,
      { headers: DEFAULT_HEADERS }
    );
  }

  getOrderDetail(id: number): Observable<DataResultDto<any>> {
    return this.http.get<DataResultDto<any>>(
      `${this.baseUrl}/documento/pedido/${id}`,
      { headers: DEFAULT_HEADERS }
    );
  }

  getCashReceiptDetail(id: number): Observable<DataResultDto<any>> {
    return this.http.get<DataResultDto<any>>(
      `${this.baseUrl}/documento/recibo-caja/${id}`,
      { headers: DEFAULT_HEADERS }
    );
  }

  private buildReportParams(query: ReportQuery): HttpParams {
    let params = new HttpParams()
      .set('fechaInicio', query.fechaInicio)
      .set('fechaFin', query.fechaFin);

    if (query.usuId)  params = params.set('usuId', query.usuId);
    if (query.plaId)  params = params.set('plaId', query.plaId);
    if (query.estId)  params = params.set('estId', query.estId);
    if (query.sedeId) params = params.set('sedeId', query.sedeId);

    return params;
  }
}
