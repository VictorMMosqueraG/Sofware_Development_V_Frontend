export interface DiningArea {
  areaId: number;
  sedeId: number;
  areaNombre: string;
  areaEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
