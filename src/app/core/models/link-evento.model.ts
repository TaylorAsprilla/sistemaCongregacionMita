export enum TIPOEVENTO_ID {
  SERVICIO = 1,
  VIGILIA = 2,
  EVENTO_ESPECIAL = 3,
}

export enum TIPOEVENTO {
  SERVICIO = 'Servicio',
  VIGILIA = 'Vigilia',
  EVENTO_ESPECIAL = 'Evento Especial',
}

export enum PLATAFORMAENUM {
  YOUTUBE = 'youtube',
  VIMEO = 'vimeo',
  ANTMEDIA = 'antmedia',
  SWARMIFY = 'swarmify',
}

export class LinkEventoModel {
  constructor(
    public id: number,
    public titulo: string,
    public link: string,
    public fecha: Date,
    public tipoEvento_id: number,
    public plataforma?: string,
    public estado?: boolean,
    public eventoEnBiblioteca?: boolean,
  ) {}
}
