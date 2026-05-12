export interface DishCategory {
  catId: number;
  catNombre: string;
  catImagen: string | null;
  catEstado: number;
  createdAt?: string;
  updatedAt?: string;
}
