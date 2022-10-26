export enum TIPOEVENTO {
  SERVICIO = 1,
  VIGILIA = 2,
  ESPECIAL = 3,
}

export class LinkEventoModel {
  constructor(
    public id: number,
    public titulo: string,
    public link: string,
    public fecha: Date,
    public tipoEvento_id: number
  ) {}
}
