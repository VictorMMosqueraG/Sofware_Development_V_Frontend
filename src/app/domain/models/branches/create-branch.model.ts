export interface CreateBranchRequest {
  sedeNombre: string;
  sedeDireccion?: string;
  sedeTelefono?: string;
  sedeEstado: 'ACTIVO' | 'INACTIVO';
}
