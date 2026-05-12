export interface PqrsType {
  tpqrsId: number;
  tpqrsDescripcion: string;
  tpqrsEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
