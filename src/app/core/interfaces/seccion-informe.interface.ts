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
  imagen: string;
  estatus: string;
  color: string;
}

export const generarSeccioninforme: Seccion[] = [
  {
    nombre: NombreSeccion.ACTIVIDADES_ECLESIASTICAS,
    ruta: `../${RUTAS.INFORME_ACTIVIDADES_ECLESIASTICAS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Servicios, vigilias, oraciones, reuniones, actividades',
    estatus: EstatusSeccion.COMPLETADO,
    color: ColorEstatus.COMPLETADO,
  },
  // B
  {
    nombre: NombreSeccion.VISITAS,
    ruta: `../${RUTAS.INFORME_VISITAS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion:
      'Atenciones y seguimiento a los hermanos mediante visitas presenciales, virtuales (Zoom, WhatsApp), llamadas y consultas',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // C
  {
    nombre: NombreSeccion.SITUACION_VISITAS,
    ruta: `../${RUTAS.SITUACION_VISITA}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Situaciones encontradas durante las visitas',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // D
  {
    nombre: NombreSeccion.ASPECTO_ESPIRITUAL,
    ruta: `../${RUTAS.INFORME_ASPECTO_ESPIRITUAL}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Actividades relacionadas al aspecto espiritual y personal',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // E
  {
    nombre: NombreSeccion.ACTIVIDADES_ECONOMICAS,
    ruta: `../${RUTAS.INFORME_ACTIVIDAD_ECONOMICA}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Actividades económicas realizadas, ventas, etc',
    estatus: EstatusSeccion.COMPLETADO,
    color: ColorEstatus.COMPLETADO,
  },
  // F
  {
    nombre: NombreSeccion.ASPECTOS_CONTABLES,
    ruta: `../${RUTAS.INFORME_DIEZMOS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Diezmos, transferencias, etc',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // G
  {
    nombre: NombreSeccion.LOGROS_OBTENIDOS,
    ruta: `../${RUTAS.INFORME_LOGROS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Logros obtenidos durante el trimestre',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // H
  {
    nombre: NombreSeccion.METAS,
    ruta: `../${RUTAS.METAS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Metas para el próximo trimestre',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // I
  {
    nombre: NombreSeccion.ASUNTOS_PENDIENTES,
    ruta: `../${RUTAS.ASUNTO_PENDIENTE}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Asuntos pendientes administrativos, eclesiásticos o de actividades',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
];
