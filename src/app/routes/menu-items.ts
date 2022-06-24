import { RouteInfo } from 'src/app/interfaces/route-info.interfase';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Administración',
    icon: '',
    class: 'nav-small-cap',

    extralink: true,
    submenu: [],
  },
  {
    path: '',
    title: 'Inicio',
    icon: 'fa fa-home',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/sistema',
        title: 'Home',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '/sistema/perfil',
        title: 'Perfil',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '/sistema/usuarios',
        title: 'Usuarios',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: 'registrarUsuario',
        title: 'Registrar Usuarios',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '/sistema/informe',
        title: 'Informes',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Censo',
    icon: 'fa fa-users',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: 'registrarUsuario',
        title: 'Registrar Hermanos',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Congregaciones',
    icon: 'mdi mdi-apps',
    class: 'has-arrow',

    extralink: false,
    submenu: [
      {
        path: 'congregacion',
        title: 'Congregaciones',
        icon: '',
        class: '',

        extralink: false,
        submenu: [],
      },
      {
        path: 'campo',
        title: 'Campos',
        icon: '',
        class: '',

        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Infomes',
    icon: '',
    class: 'nav-small-cap',

    extralink: true,
    submenu: [],
  },
  {
    path: '',
    title: 'Crear Informe',
    icon: 'fa fa-book',
    class: 'has-arrow',

    extralink: false,
    submenu: [
      {
        path: '/sistema/informe',
        title: 'Generar Informe',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '',
        title: 'Ver Informes',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
    ],
  },
];
