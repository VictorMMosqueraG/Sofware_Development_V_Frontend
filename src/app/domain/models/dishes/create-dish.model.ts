export interface CreateDishRequest {
  catId: number;
  plaDescripcion: string;
  plaCodigo?: string;
  plaPrecio: number;
  plaCosto?: number;
  plaImagen?: string;
  estId: number;
}
