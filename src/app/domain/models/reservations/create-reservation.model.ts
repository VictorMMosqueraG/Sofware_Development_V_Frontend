export interface CreateReservationRequest {
  sedeId: number;
  resNombreCli: string;
  resTelefono?: string;
  resFechaHora: string;
  resPersonas: number;
  mesaId?: number;
  resNota?: string;
  resEstado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
}
