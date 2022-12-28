export class usuariosSupervisorModel {
  constructor(
    public id: number,
    public primerNombre: string,
    public primerApellido: string,
    public pais: string,
    public obrero_id: number,
    public segundoApellido?: string,
    public segundoNombre?: string,
    public congregacion?: string
  ) {}
}
