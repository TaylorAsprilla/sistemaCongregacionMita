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
    ruta: Rutas.INFORME_ACTIVIDADES,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Informe de actividades realizadas',
    estatus: 'Completado',
    color: 'seagreen',
  },
  {
    nombre: 'Informe de Contables',
    ruta: Rutas.INFORME_CONTABLE,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Informe para presentar a los contalbles',
    estatus: 'N / A',
    color: 'gold',
  },
  {
    nombre: 'Crear Actividad',
    ruta: Rutas.CREAR_ACTIVIDAD,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Crea una nueva actividad para tu informe',
    estatus: 'N / A',
    color: 'crimson',
  },
  {
    nombre: 'Crear Actividad',
    ruta: Rutas.CREAR_ACTIVIDAD,
    imagen: '../assets/images/iconSeccionInforme.jpeg',
    descripcion: 'Crea una nueva actividad para tu informe',
    estatus: 'N / A',
    color: 'crimson',
  },
];
