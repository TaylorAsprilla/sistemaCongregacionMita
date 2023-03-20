export enum TIPO_DOCUMENTO {
  SIN_DOCUMENTO = 'Sin Documento',
}

export enum TIPO_DOCUMENTO_ID {
  SIN_DOCUMENTO = '1',
}

export class TipoDocumentoModel {
  constructor(public id: number, public documento: string, public pais_id: number, public estado: boolean) {}
}
