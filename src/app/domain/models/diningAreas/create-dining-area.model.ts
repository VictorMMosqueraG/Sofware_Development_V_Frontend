export interface CreateDiningAreaRequest {
  sedeId: number;
  areaNombre: string;
  areaEstado: 'ACTIVO' | 'INACTIVO';
}
