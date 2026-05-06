import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { DEFAULT_HEADERS } from '../config/http.config';
import { DataResultDto, Sede, UserLookup, OrderLookup, FormaPago, PlatoLookup, CashReceipt } from '../../domain/models';

@Injectable({ providedIn: 'root' })
export class LookupHttpService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/lookup`;

  constructor(private readonly http: HttpClient) {}

  getSedes(): Observable<DataResultDto<Sede[]>> {
    return this.http.get<DataResultDto<Sede[]>>(`${this.baseUrl}/sedes`, {
      headers: DEFAULT_HEADERS,
    });
  }

  getUsuarios(): Observable<DataResultDto<UserLookup[]>> {
    return this.http.get<DataResultDto<UserLookup[]>>(`${this.baseUrl}/usuarios`, {
      headers: DEFAULT_HEADERS,
    });
  }

  getPedidos(): Observable<DataResultDto<OrderLookup[]>> {
    return this.http.get<DataResultDto<OrderLookup[]>>(`${this.baseUrl}/pedidos`, {
      headers: DEFAULT_HEADERS,
    });
  }

  getFormasPago(): Observable<DataResultDto<FormaPago[]>> {
    return this.http.get<DataResultDto<FormaPago[]>>(`${this.baseUrl}/formas-pago`, {
      headers: DEFAULT_HEADERS,
    });
  }

  getPlatos(): Observable<DataResultDto<PlatoLookup[]>> {
    return this.http.get<DataResultDto<PlatoLookup[]>>(`${this.baseUrl}/platos`, {
      headers: DEFAULT_HEADERS,
    });
  }

  getRecibos(): Observable<DataResultDto<CashReceipt[]>> {
    return this.http.get<DataResultDto<CashReceipt[]>>(`${this.baseUrl}/recibos`, {
      headers: DEFAULT_HEADERS,
    });
  }
}
