export interface Pqrs {
  pqrsId: number;
  pqrsFecha: string;
  pqrsDescripcion: string;
  pqrsCorreo: string;
  pqrsTelefono: string;
  tpqrsId: number;
  estId: number;
  pqrsRespuesta: string | null;
  usuIdResponde: number | null;
  createdAt?: string;
  updatedAt?: string;
}
