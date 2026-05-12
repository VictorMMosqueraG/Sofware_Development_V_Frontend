export interface Order {
  pedId: number;
  sedeId: number;
  pedFecha: string;
  usuId: number;
  mesaId: number | null;
  estId: number;
  pedObs: string | null;
  createdAt?: string;
  updatedAt?: string;
}
