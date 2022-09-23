export class LogroModel {
  constructor(
    public id: number,
    public logro: string,
    public respondable: string,
    public informe_id: number,
    public comentarios?: string
  ) {}
}
