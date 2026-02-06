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
  ACTIVIDADES_ECONOMICAS = 'Actividades Económicas',
  ASPECTOS_CONTABLES = 'Diezmos',
  METAS = 'Metas',
  VISITAS = 'Atenciones y seguimiento a los hermanos',
  SITUACION_VISITAS = 'Situación en las visitas',
  LOGROS_OBTENIDOS = 'Logros obtenidos',
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
  {
    nombre: NombreSeccion.ACTIVIDADES_ECONOMICAS,
    ruta: `../${RUTAS.INFORME_ACTIVIDAD_ECONOMICA}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Actividades económicas realizadas, ventas, etc',
    estatus: EstatusSeccion.COMPLETADO,
    color: ColorEstatus.COMPLETADO,
  },
  {
    nombre: NombreSeccion.ASPECTOS_CONTABLES,
    ruta: `../${RUTAS.INFORME_DIEZMOS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Diezmos, transferencias, etc',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  {
    nombre: NombreSeccion.METAS,
    ruta: `../${RUTAS.METAS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Metas para el próximo trimestre',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  {
    nombre: NombreSeccion.VISITAS,
    ruta: `../${RUTAS.INFORME_VISITAS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion:
      'Atenciones y seguimiento a los hermanos mediante visitas presenciales, virtuales (Zoom, WhatsApp), llamadas y consultas',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  {
    nombre: NombreSeccion.SITUACION_VISITAS,
    ruta: `../${RUTAS.SITUACION_VISITA}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Situaciones encontradas durante las visitas',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  {
    nombre: NombreSeccion.LOGROS_OBTENIDOS,
    ruta: `../${RUTAS.INFORME_LOGROS}`,
    imagen: 'assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Logros obtenidos durante el trimestre',
    estatus: EstatusSeccion.PENDIENTE,
    color: ColorEstatus.PENDIENTE,
  },
  // asuntos pendientes eliminado
];
