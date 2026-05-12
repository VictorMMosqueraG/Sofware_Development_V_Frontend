export interface CreateOrderRequest {
  sedeId: number;
  pedFecha: string;
  usuId: number;
  mesaId?: number;
  estId: number;
  pedObs?: string;
}
