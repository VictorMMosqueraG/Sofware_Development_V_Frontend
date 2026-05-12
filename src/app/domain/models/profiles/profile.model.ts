export interface Profile {
  perfId: number;
  perfDescripcion: string;
  perfEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
