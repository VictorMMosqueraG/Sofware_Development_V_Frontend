export interface UpdateBranchRequest {
  sedeNombre?: string;
  sedeDireccion?: string;
  sedeTelefono?: string;
  sedeEstado?: 'ACTIVO' | 'INACTIVO';
}
