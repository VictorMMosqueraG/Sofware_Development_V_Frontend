export interface Reservation {
  resId: number;
  sedeId: number;
  resNombreCli: string;
  resTelefono: string | null;
  resFechaHora: string;
  resPersonas: number;
  mesaId: number | null;
  resNota: string | null;
  resEstado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
  createdAt?: string;
  updatedAt?: string;
}
