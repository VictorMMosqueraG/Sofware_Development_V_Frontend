export interface Dish {
  plaId: number;
  catId: number;
  plaDescripcion: string;
  plaCodigo: string | null;
  plaPrecio: number;
  plaCosto: number | null;
  plaImagen: string | null;
  estId: number;
  createdAt?: string;
  updatedAt?: string;
}
