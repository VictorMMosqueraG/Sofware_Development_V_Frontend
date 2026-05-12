export interface DiningTable {
  mesaId: number;
  sedeId: number;
  areaId?: number | null;
  mesaNumero: string;
  capacidad: number;
  xPos: number;
  yPos: number;
  estado: 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA' | 'INACTIVA';
  createdAt?: string;
  updatedAt?: string;
}
