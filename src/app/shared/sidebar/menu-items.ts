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
        path: '',
        title: 'Perfil',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '',
        title: 'Informes',
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
      {
        path: '',
        title: 'Usuarios',
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
        path: '',
        title: 'Parte Uno',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '',
        title: 'Parte Dos',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '',
        title: 'Parte Tres',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
    ],
  },
];
