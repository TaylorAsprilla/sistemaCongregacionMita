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
    role: [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.MULTIMEDIA,
      ROLES.ADMINISTRADOR_MULTIMEDIA,
      ROLES.ASISTENTE_OOTS,
    ],
  },
  {
    nombreSeccion: 'Censo',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/censo.png',
    ruta: `../${RUTAS.USUARIOS}`,
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
  },
  {
    nombreSeccion: 'Informes',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-informes.png',
    ruta: `../${RUTAS.INFORME}`,
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
  },
  {
    nombreSeccion: 'Congregaciones',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-congregacion.png',
    ruta: `../${RUTAS.CONGREGACIONES}`,
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
  },
];
