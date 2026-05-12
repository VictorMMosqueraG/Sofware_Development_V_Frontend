export interface OrderDetail {
  pedDetId: number;
  pedId: number;
  plaId: number;
  pedDetCant: number;
  pedDetPrecio: number;
  pedDetObser: string | null;
  estId: number;
  createdAt?: string;
  updatedAt?: string;
}
