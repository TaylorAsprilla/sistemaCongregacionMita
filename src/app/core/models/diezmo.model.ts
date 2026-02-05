export class DiezmoModel {
  constructor(
    public sobresRestrictos: number,
    public sobresNoRestrictos: number,
    public restrictos: number,
    public noRestrictos: number,
    public mes: number,
    public informe_id: number,
    public id?: number,
    public estado?: boolean,
  ) {}
}
