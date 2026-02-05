export class LogroModel {
  constructor(
    public id: number,
    public logro: string,
    public responsable: string,
    public fecha: string,
    public informe_id: number,
    public comentarios?: string,
    public estado?: boolean,
  ) {}
}
