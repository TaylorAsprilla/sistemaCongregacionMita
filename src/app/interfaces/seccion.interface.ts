import { Rutas } from '../routes/menu-items';

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
    ruta: `../${Rutas.INFORME_ACTIVIDADES}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Servicios, vigilias, oraciones, reuniones, actividades',
    estatus: 'Completado',
    color: 'seagreen',
  },
  {
    nombre: 'Aspectos Contables',
    ruta: `../${Rutas.INFORME_CONTABLE}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Diezmos, transferencias, etc',
    estatus: 'N / A',
    color: 'gold',
  },
  {
    nombre: 'Metas',
    ruta: `../${Rutas.METAS}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Metas para el próximo trimestre',
    estatus: 'N / A',
    color: 'crimson',
  },
  {
    nombre: 'Visitas',
    ruta: `../${Rutas.INFORME_VISITAS}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Informe de las visitas realizadas a los/as feligreses',
    estatus: 'N / A',
    color: 'crimson',
  },
  {
    nombre: 'Situación en las visitas',
    ruta: `../${Rutas.SITUACION_VISITA}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Situaciones encontradas durante las visitas',
    estatus: 'N / A',
    color: 'crimson',
  },
  {
    nombre: 'Logros obtenidos',
    ruta: `../${Rutas.INFORME_LOGROS}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Logros obtenidos durante el trimestre',
    estatus: 'N / A',
    color: 'crimson',
  },
  {
    nombre: 'Asunto pendiente',
    ruta: `../${Rutas.ASUNTO_PENDIENTE}`,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Logros obtenidos durante el trimestre',
    estatus: 'N / A',
    color: 'crimson',
  },
];
