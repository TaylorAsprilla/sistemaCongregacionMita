import { ROLES, RUTAS } from '../../routes/menu-items';

export interface SeccionHome {
  nombreSeccion: string;
  nombreResponsable: string;
  email: string;
  logo: string;
  ruta: string;
  role?: ROLES[];
}

export const generarSeccionHome: SeccionHome[] = [
  {
    nombreSeccion: 'CMAR Live',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-multimedia.png',
    ruta: `../${RUTAS.SERVICIOS_Y_VIGILIAS}`,
    role: [ROLES.MULTIMEDIA],
  },
  {
    nombreSeccion: 'Censo',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/censo.png',
    ruta: `../${RUTAS.USUARIOS}`,
    role: [ROLES.ADMINISTRADOR],
  },
  {
    nombreSeccion: 'Informes',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-informes.png',
    ruta: `../${RUTAS.INFORME}`,
    role: [ROLES.ADMINISTRADOR],
  },
  {
    nombreSeccion: 'Congregaciones',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-congregacion.png',
    ruta: `../${RUTAS.CONGREGACIONES}`,
    role: [ROLES.OBRERO],
  },
];
