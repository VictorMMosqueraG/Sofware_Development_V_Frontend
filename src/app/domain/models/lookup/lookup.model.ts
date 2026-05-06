export interface Sede {
  sedeId: number;
  sedeNombre: string;
  sedeDireccion?: string;
  sedeTelefono?: string;
  sedeEstado: string;
}

export interface UserLookup {
  usuId: number;
  usuNombre: string;
}

export interface OrderLookup {
  pedId: number;
  pedMesa?: string;
}

export interface FormaPago {
  fpId: number;
  fpDescripcion: string;
  fpEstado: string;
}

export interface PlatoLookup {
  plaId: number;
  plaDescripcion: string;
  plaPrecio: number;
}
