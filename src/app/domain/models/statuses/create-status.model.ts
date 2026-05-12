export interface CreateStatusRequest {
  estDescripcion: string;
  tesId: number;
  estEstado: 'ACTIVO' | 'INACTIVO';
}
