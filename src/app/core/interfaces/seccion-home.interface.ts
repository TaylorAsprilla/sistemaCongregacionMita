import { ROLES, RUTAS } from '../../routes/menu-items';

export interface SeccionHome {
  nombreSeccion: string;
  nombreResponsable: string;
  email: string;
  logo: string;
  ruta?: string;
  role?: ROLES[];
}

export const generarSeccionHome: SeccionHome[] = [
  {
    nombreSeccion: 'CMAR Live',
    nombreResponsable: '',
    email: '',
    ruta: `./../${RUTAS.EVENTOS_EN_VIVO}`,
    logo: 'assets/images/vista-principal/logo-multimedia.png',
    role: [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.ADMINISTRADOR_MULTIMEDIA,
      ROLES.ASISTENTE_OOTS,
      ROLES.AYUDANTE,
    ],
  },
  {
    nombreSeccion: 'Censo',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/censo.png',
    ruta: `../${RUTAS.CENSO}`,
    role: [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.ASISTENTE_OOTS,
    ],
  },
  {
    nombreSeccion: 'Censo Ayudante',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/censo.png',
    ruta: `../${RUTAS.USUARIOS_AYUDANTE}`,
    role: [ROLES.AYUDANTE],
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
    role: [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.ASISTENTE_OOTS,
    ],
  },
];
