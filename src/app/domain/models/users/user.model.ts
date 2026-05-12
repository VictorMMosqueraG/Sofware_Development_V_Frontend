export interface User {
  usuId: number;
  usuNombre: string;
  usuApellido: string;
  usuDireccion: string;
  usuTelefono: string;
  usuCorreo: string;
  perfId?: number | null;
  usuLogin: string;
  usuPass: string;
  usuEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
