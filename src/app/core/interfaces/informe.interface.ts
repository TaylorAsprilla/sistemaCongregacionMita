export interface VerificarInformeAbiertoResponseInterface {
  tieneInformeAbierto: boolean;
  informe?: {
    id: number;
    usuario_id: number;
    estado: string;
    createdAt: string;
    updatedAt: string;
  };
  msg: string;
}

// Interfaces para informes del trimestre por país
export interface InformeTrimestrePaisResponse {
  ok: boolean;
  informes: InformeCompletoPais[];
  msg: string;
  estadisticas: EstadisticasPais;
}

export interface InformeCompletoPais {
  id: number;
  usuario_id: number;
  estado: string;
  createdAt: string;
  updatedAt: string;
  usuario: UsuarioInforme;
  actividades: ActividadEclesiastica[];
  actividadesEconomicas: ActividadEconomica[];
  visitas: Visita[];
  situacionVisita: SituacionVisita[];
  aspectoContable: AspectosContable[];
  logros: Logro[];
  metas: Meta[];
}

export interface UsuarioInforme {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  congregacion?: {
    nombre: string;
  };
  campo?: {
    nombre: string;
  };
}

export interface ActividadEclesiastica {
  id: number;
  fecha: string;
  responsable: string;
  asistencia: number;
  observaciones: string;
  informe_id: number;
  tipoActividad_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActividadEconomica {
  id: number;
  fecha: string;
  cantidadRecaudada: string;
  responsable: string;
  asistencia: number;
  observaciones: string;
  informe_id: number;
  tipoActividadEconomica_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Visita {
  id: number;
  mes: number;
  referidasOots: number;
  visitasHogares: number;
  visitaHospital: number;
  observaciones: string;
  estado: boolean;
  informe_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface SituacionVisita {
  id: number;
  fecha: string;
  nombreFeligres: string;
  situacion: string;
  intervencion: string;
  seguimiento: string;
  observaciones: string;
  informe_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface AspectosContable {
  id: number;
  sobresRestrictos: number;
  sobresNoRestrictos: number;
  restrictos: number;
  noRestrictos: number;
  mes: number;
  informe_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Logro {
  id: number;
  logro: string;
  responsable: string;
  fecha: string | null;
  comentarios: string | null;
  estado: boolean;
  informe_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  id: number;
  fecha: string;
  meta: string;
  accion: string;
  comentarios: string;
  estado: boolean;
  informe_id: number;
  tipoStatus_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface EstadisticasPais {
  trimestre: number;
  año: number;
  pais: string;
  fechaInicio: string;
  fechaFin: string;
  totalCongregaciones: number;
  totalCampos: number;
  totalObreros: number;
  totalInformes: number;
}
