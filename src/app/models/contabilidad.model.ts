export class ContabilidadModel {
  constructor(
    public id: number,
    public sobres: number,
    public transferencia: number,
    public restrictos: string,
    public noRestrictos: number,
    public depositoActividades: number,
    public informe_id: number
  ) {}
}
