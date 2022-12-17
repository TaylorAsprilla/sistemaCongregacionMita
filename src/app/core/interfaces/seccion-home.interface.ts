import { ROLES, Rutas } from '../../routes/menu-items';

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
    nombreResponsable: 'Juan Carlos Mejía',
    email: 'juan.mejia@congregacionmita.org',
    logo: 'assets/images/vista-principal/logo-multimedia.png',
    ruta: `../${Rutas.SERVICIOS_Y_VIGILIAS}`,
    role: [ROLES.MULTIMEDIA],
  },
  {
    nombreSeccion: 'Censo',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/censo.png',
    ruta: `../${Rutas.USUARIOS}`,
    role: [ROLES.ADMINISTRADOR],
  },
  {
    nombreSeccion: 'Informes',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-informes.png',
    ruta: `../${Rutas.INFORME}`,
    role: [ROLES.ADMINISTRADOR],
  },
  {
    nombreSeccion: 'Congregaciones',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-congregacion.png',
    ruta: `../${Rutas.CONGREGACIONES}`,
    role: [ROLES.OBRERO],
  },
];
