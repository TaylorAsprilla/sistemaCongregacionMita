import { ROLES, RUTAS } from '../../routes/menu-items';

export interface SeccionHomeInterface {
  nombreSeccion: string;
  nombreResponsable: string;
  email: string;
  logo: string;
  ruta?: string;
  role?: ROLES[];
}

export const generarSeccionHome: SeccionHomeInterface[] = [
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
      ROLES.OBRERO_PAIS,
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
      ROLES.OBRERO_PAIS,
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
    ruta: `../${RUTAS.VER_INFORMES_PAIS}`,
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.OBRERO_PAIS],
  },
  {
    nombreSeccion: 'Países',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-congregacion.png',
    ruta: `../${RUTAS.PAISES}`,
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
  },
  {
    nombreSeccion: 'Congregaciones',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-congregacion.png',
    ruta: `../${RUTAS.CONGREGACIONES}`,
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
  },
  {
    nombreSeccion: 'Campos',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/logo-congregacion.png',
    ruta: `../${RUTAS.CAMPOS}`,
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
  },
  {
    nombreSeccion: 'Generar QR',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/generar-qr.png',
    ruta: `../${RUTAS.GENERAR_QR}`,
    role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS, ROLES.COMITE_RECTOR],
  },
  {
    nombreSeccion: 'Dashboard',
    nombreResponsable: '',
    email: '',
    logo: 'assets/images/vista-principal/dashboard.png',
    ruta: `../${RUTAS.DASHBOARD_OBRERO}`,
    role: [ROLES.ADMINISTRADOR, ROLES.OBRERO_PAIS, ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
  },
];
