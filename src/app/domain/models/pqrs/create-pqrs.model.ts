export interface CreatePqrsRequest {
  pqrsFecha: string;
  pqrsDescripcion: string;
  pqrsCorreo: string;
  pqrsTelefono: string;
  tpqrsId: number;
  estId: number;
  pqrsRespuesta?: string;
  usuIdResponde?: number;
}
