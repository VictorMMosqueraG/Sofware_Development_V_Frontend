export interface StatusType {
  tesId: number;
  tesDescripcion: string;
  tesEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
