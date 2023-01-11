import { RUTAS } from '../../routes/menu-items';

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
    nombre: 'Informe de Actividades',
    ruta: `../${RUTAS.INFORME_ACTIVIDADES}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Servicios, vigilias, oraciones, reuniones, actividades',
    estatus: 'Completado',
    color: 'seagreen',
  },
  {
    nombre: 'Aspectos Contables',
    ruta: `../${RUTAS.INFORME_CONTABLE}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Diezmos, transferencias, etc',
    estatus: 'N / A',
    color: 'gold',
  },
  {
    nombre: 'Metas',
    ruta: `../${RUTAS.METAS}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Metas para el próximo trimestre',
    estatus: 'N / A',
    color: 'crimson',
  },
  {
    nombre: 'Visitas',
    ruta: `../${RUTAS.INFORME_VISITAS}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Informe de las visitas realizadas a los/as feligreses',
    estatus: 'N / A',
    color: 'crimson',
  },
  {
    nombre: 'Situación en las visitas',
    ruta: `../${RUTAS.SITUACION_VISITA}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Situaciones encontradas durante las visitas',
    estatus: 'N / A',
    color: 'crimson',
  },
  {
    nombre: 'Logros obtenidos',
    ruta: `../${RUTAS.INFORME_LOGROS}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Logros obtenidos durante el trimestre',
    estatus: 'N / A',
    color: 'crimson',
  },
  // asuntos pendientes eliminado
];
