export interface ReportQuery {
  fechaInicio: string;
  fechaFin: string;
  usuId?: number;
  plaId?: number;
  estId?: number;
  sedeId?: number;
}

export interface ReportDetailQuery {
  plaIds: number[];
  fechaInicio: string;
  fechaFin: string;
  sedeId?: number;
  usuId?: number;
}
