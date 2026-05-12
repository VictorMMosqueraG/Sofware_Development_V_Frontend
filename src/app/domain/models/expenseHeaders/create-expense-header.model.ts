export interface CreateExpenseHeaderRequest {
  sedeId: number;
  noEgreso: number;
  fechaDocumento: string;
  terceroIdentificacion: string;
  terceroNombre?: string;
  detalle: string;
  fpId: number;
  conId: number;
  noDocumento: string;
  valorEgreso: number;
  usuId: number;
  egrEstado: 'ACTIVO' | 'ANULADO';
}
