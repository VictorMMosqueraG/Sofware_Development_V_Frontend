export interface UpdateDiningTableRequest {
  sedeId?: number;
  areaId?: number;
  mesaNumero?: string;
  capacidad?: number;
  xPos?: number;
  yPos?: number;
  estado?: 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA' | 'INACTIVA';
}
