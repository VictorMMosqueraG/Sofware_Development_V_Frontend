export interface UpdateStatusRequest {
  estDescripcion?: string;
  tesId?: number;
  estEstado?: 'ACTIVO' | 'INACTIVO';
}
