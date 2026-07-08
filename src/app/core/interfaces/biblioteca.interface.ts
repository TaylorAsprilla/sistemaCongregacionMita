import { PLATAFORMAENUM } from '../models/link-evento.model';

export interface bibliotecaEventoInterface {
  titulo: string;
  link: string;
  fecha: Date;
  tipoEvento_id: number;
  plataforma?: PLATAFORMAENUM;
  estado?: boolean;
  eventoEnBiblioteca?: boolean;
}
