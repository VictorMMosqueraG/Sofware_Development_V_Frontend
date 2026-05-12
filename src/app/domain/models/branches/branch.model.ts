export interface Branch {
  sedeId: number;
  sedeNombre: string;
  sedeDireccion?: string | null;
  sedeTelefono?: string | null;
  sedeEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
