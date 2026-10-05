import { RUTAS } from '../../routes/menu-items';

export enum EstatusSeccion {
  COMPLETADO = 'Completado',
  PENDIENTE = 'Pendiente',
}

export enum ColorEstatus {
  COMPLETADO = 'seagreen',
  PENDIENTE = 'crimson',
}

export enum NombreSeccion {
  ACTIVIDADES_ECLESIASTICAS = 'Actividades Eclesiasticas',
  VISITAS = 'Visitas Realizadas',
  SITUACION_VISITAS = 'Situación en las visitas',
  ASPECTO_ESPIRITUAL = 'Actividades Relacionadas al Aspecto Espiritual y Personal',
  ACTIVIDADES_ECONOMICAS = 'Actividades Económicas',
  ASPECTOS_CONTABLES = 'Diezmos',
  LOGROS_OBTENIDOS = 'Logros obtenidos',
  METAS = 'Metas',
  ASUNTOS_PENDIENTES = 'Asuntos Pendientes',
}

export interface Seccion {
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: string;
  estatus: string;
  color: string;
}

export const generarSeccioninforme: Seccion[] = [
  {
    nombre: NombreSeccion.ACTIVIDADES_ECLESIASTICAS,
    ruta: `../${RUTAS.INFORME_ACTIVIDADES_ECLESIASTICAS}`,
    icono: 'fa-calendar-check-o',
    descripcion: 'Servicios, vigilias, oraciones, reuniones, actividades',
    estatus: EstatusSeccion.COMPLETADO,
    color: ColorEstatus.COMPLETADO,
  },
  // B
  {
    nombre: NombreSeccion.VISITAS,
    ruta: `../${RUTAS.INFORME_VISITAS}`,
    icono: 'fa-handshake-o',
    descripcion:
      'Atenciones y seguimiento a los hermanos mediante visitas presenciales, virtuales (Zoom, WhatsApp), llamadas y consultas',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // C
  {
    nombre: NombreSeccion.SITUACION_VISITAS,
    ruta: `../${RUTAS.SITUACION_VISITA}`,
    icono: 'fa-exclamation-triangle',
    descripcion: 'Situaciones encontradas durante las visitas',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // D
  {
    nombre: NombreSeccion.ASPECTO_ESPIRITUAL,
    ruta: `../${RUTAS.INFORME_ASPECTO_ESPIRITUAL}`,
    icono: 'fa-heart-o',
    descripcion: 'Actividades relacionadas al aspecto espiritual y personal',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // E
  {
    nombre: NombreSeccion.ACTIVIDADES_ECONOMICAS,
    ruta: `../${RUTAS.INFORME_ACTIVIDAD_ECONOMICA}`,
    icono: 'fa-line-chart',
    descripcion: 'Actividades económicas realizadas, ventas, etc',
    estatus: EstatusSeccion.COMPLETADO,
    color: ColorEstatus.COMPLETADO,
  },
  // F
  {
    nombre: NombreSeccion.ASPECTOS_CONTABLES,
    ruta: `../${RUTAS.INFORME_DIEZMOS}`,
    icono: 'fa-calculator',
    descripcion: 'Diezmos, transferencias, etc',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // G
  {
    nombre: NombreSeccion.LOGROS_OBTENIDOS,
    ruta: `../${RUTAS.INFORME_LOGROS}`,
    icono: 'fa-trophy',
    descripcion: 'Logros obtenidos durante el trimestre',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // H
  {
    nombre: NombreSeccion.METAS,
    ruta: `../${RUTAS.METAS}`,
    icono: 'fa-bullseye',
    descripcion: 'Metas para el próximo trimestre',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // I
  {
    nombre: NombreSeccion.ASUNTOS_PENDIENTES,
    ruta: `../${RUTAS.ASUNTO_PENDIENTE}`,
    icono: 'fa-clipboard',
    descripcion: 'Asuntos pendientes administrativos, eclesiásticos o de actividades',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
];
