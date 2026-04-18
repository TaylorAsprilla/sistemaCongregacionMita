export class AspectoEspiritualModel {
  constructor(
    public id: number,
    public categoria_id: number,
    public observaciones: string,
    public responsable: string,
    public informe_id: number,
    public fecha?: string,
    public estado?: boolean,
    public categoria?: { id: number; nombre: string; descripcion?: string },
  ) {}
}
