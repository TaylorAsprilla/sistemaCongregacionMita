export interface VerificarInformeAbiertoResponseInterface {
  tieneInformeAbierto: boolean;
  informe?: {
    id: number;
    usuario_id: number;
    estado: string;
    createdAt: string;
    updatedAt: string;
  };
  msg: string;
}
