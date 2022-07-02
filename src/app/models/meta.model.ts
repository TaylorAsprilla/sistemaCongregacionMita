export class MetaModel {
  constructor(
    public id: number,
    public meta: string,
    public fecha: Date,
    public accion: string,
    public informe_id: number,
    public tipoStatus_id: number,
    public comentarios?: string
  ) {}
}
