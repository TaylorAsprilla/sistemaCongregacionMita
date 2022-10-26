import { RouteInfo } from 'src/app/core/interfaces/route-info.interfase';

export enum Rutas {
  ASUNTO_PENDIENTE = 'asunto-pendiente',
  BIBLIOTECA_MULTIMEDIA = 'biblioteca-multimedia',
  BIBLIOTECA_SERVICIOS = 'biblioteca-servicios',
  BIBLIOTECA_VIGILIAS = 'biblioteca-vigilias',
  CAMPOS = 'campos',
  CONFIGURAR_SERVICIOS_Y_VIGILIAS = 'configurar-servicios-y-vigilias',
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
  MINISTERIOS = 'ministerios',
  PAISES = 'paises',
  PERFIL = 'perfil',
  USUARIOS = 'usuarios',
  REGISTRAR_USUARIO = 'registrar-usuario',
  SERVICIOS_Y_VIGILIAS = 'servicios-y-vigilias',
  SISTEMA = 'sistema',
  SITUACION_VISITA = 'situacion-visita',
  SOLICITUD_MULTIMEDIA = 'solicitud-multimedia',
  SOLICITUDES_MULTIMEDIA = 'solicitudes-multimedia',
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
        path: Rutas.MINISTERIOS,
        title: 'Ministerios',
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
        path: Rutas.USUARIOS,
        title: 'Feligreses',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Multimedia',
    icon: 'fa fa-tv',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: Rutas.CONFIGURAR_SERVICIOS_Y_VIGILIAS,
        title: 'Configurar Servicios y Vigilias',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: Rutas.SOLICITUDES_MULTIMEDIA,
        title: 'Solicitud de Acceso',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: `${Rutas.SOLICITUD_MULTIMEDIA}/nuevo`,
        title: 'Nueva Solicitud',
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
  {
    path: '',
    title: 'Live',
    icon: '',
    class: 'nav-small-cap',

    extralink: true,
    submenu: [],
  },
  {
    path: '',
    title: 'Multimedia LIVE',
    icon: 'fa fa-tv',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: Rutas.SERVICIOS_Y_VIGILIAS,
        title: 'Servicios y Vigilias',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '',
        title: 'Biblioteca Multimedia',
        icon: '',
        class: 'has-arrow',
        extralink: false,
        submenu: [
          {
            path: Rutas.BIBLIOTECA_SERVICIOS,
            title: 'Servicios',
            icon: '',
            class: '',
            extralink: false,
            submenu: [],
          },
          {
            path: Rutas.BIBLIOTECA_VIGILIAS,
            title: 'Vigilias',
            icon: '',
            class: '',
            extralink: false,
            submenu: [],
          },
        ],
      },
    ],
  },
];
