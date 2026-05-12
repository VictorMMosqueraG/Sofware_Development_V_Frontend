export interface Status {
  estId: number;
  estDescripcion: string;
  tesId: number;
  estEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
