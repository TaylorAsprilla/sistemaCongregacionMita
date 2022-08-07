import { RouteInfo } from 'src/app/interfaces/route-info.interfase';

export enum Rutas {
  ASUNTO_PENDIENTE = 'asunto-pendiente',

  CAMPOS = 'campos',
  CONGREGACION = 'congregacion',
  CONGREGACIONES = 'congregaciones',
  CREAR_TIPO_ACTIVIDAD = 'crear-tipo-actividad',
  CREAR_CAMPO = 'crear-campo',
  CREAR_CONGREGACION = 'crear-congregacion',
  CREAR_PAIS = 'crear-pais',
  CREAR_ESTATUS = 'crear-estatus',
  INICIO = 'inicio',
  INFORME = 'informe',
  INFORME_ACTIVIDADES = 'informe-actividades',
  INFORME_CONTABLE = 'informe-contable',
  INFORME_LOGROS = 'informe-logros',
  INFORME_VISITAS = 'informe-visitas',
  METAS = 'metas',
  PAISES = 'paises',
  PERFIL = 'perfil',
  USUARIOS = 'usuarios',
  REGISTRAR_USUARIO = 'registrar-usuario',
  SISTEMA = 'sistema',
  SITUACION_VISITA = 'situacion-visita',
  RUTA_NUEVA = 'ruta-nueva',
  VER_INFORME = 'ver-informe',
}

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
        path: Rutas.INICIO,
        title: 'Inicio',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.PERFIL,
        title: 'Perfil',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.USUARIOS,
        title: 'Usuarios',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.REGISTRAR_USUARIO,
        title: 'Registrar Usuarios',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.INFORME,
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
        path: Rutas.REGISTRAR_USUARIO,
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
    title: 'Informes',
    icon: 'fa fa-book',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: Rutas.CREAR_TIPO_ACTIVIDAD,
        title: 'Crear Actividad',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.CREAR_ESTATUS,
        title: 'Crear estatus',
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
        path: Rutas.PAISES,
        title: 'Paises',
        icon: '',
        class: '',

        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.CONGREGACIONES,
        title: 'Congregaciones',
        icon: '',
        class: '',

        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.CAMPOS,
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
        path: Rutas.INFORME,
        title: 'Generar Informe',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.VER_INFORME,
        title: 'Ver Informe',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
    ],
  },
];
