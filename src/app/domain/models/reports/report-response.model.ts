export interface RankingItem {
  id: number;
  descripcion: string;
  cantidad: number;
  totalFacturado: number;
}

export interface MonthlyData {
  anio: number;
  mes: number;
  nombreMes: string;
  cantidad: number;
  totalFacturado: number;
}

export interface BranchMonthlyData {
  sedeId: number;
  sedeNombre: string;
  anio: number;
  mes: number;
  nombreMes: string;
  cantidad: number;
  totalFacturado: number;
}

export interface ChartData {
  barrasMensual: MonthlyData[];
  circular: RankingItem[];
  barrasAgrupadas: BranchMonthlyData[];
}

export interface Indicator {
  totalUnidadesVendidas: number;
  totalFacturado: number;
  promedioVentaDiaria: number;
  platoMasVendido: string;
  sedeMasVentas: string;
  totalPedidos: number;
}

export interface SalesReportResponse {
  ranking: RankingItem[];
  graficos: ChartData;
  indicadores: Indicator;
}

export interface ReportDetailItem {
  tipoDocumento: string;
  documentoId: number;
  fecha: string;
  cliente: string;
  documento: string;
  total: number;
  platoDescripcion: string;
  cantidad: number;
  sedeNombre: string;
  mesero: string;
}
