import { RouteInfo } from 'src/app/core/interfaces/route-info.interfase';

export enum RUTAS {
  ASUNTO_PENDIENTE = 'asunto-pendiente',
  BIBLIOTECA_MULTIMEDIA = 'biblioteca-multimedia',
  BIBLIOTECA_SERVICIOS = 'biblioteca-servicios',
  BIBLIOTECA_VIGILIAS = 'biblioteca-vigilias',
  CAMPOS = 'campos',
  CONFIGURAR_SERVICIOS_Y_VIGILIAS = 'configurar-servicios-y-vigilias',
  CONFIRMAR_REGISTRO = 'confirmar-registro',
  CONGREGACION = 'congregacion',
  CONGREGACIONES = 'congregaciones',
  CREAR_TIPO_ACTIVIDAD = 'crear-tipo-actividad',
  CREAR_CAMPO = 'crear-campo',
  CREAR_CONGREGACION = 'crear-congregacion',
  CREAR_EVENTO = 'crear-evento',
  CREAR_PAIS = 'crear-pais',
  CREAR_ESTATUS = 'crear-estatus',
  EVENTOS = 'eventos',
  INICIO = 'inicio',
  INFORME = 'informe',
  INFORME_ACTIVIDADES = 'informe-actividades',
  INFORME_CONTABLE = 'informe-contable',
  INFORME_LOGROS = 'informe-logros',
  INFORME_VISITAS = 'informe-visitas',
  LOGIN = '/login',
  METAS = 'metas',
  MINISTERIOS = 'ministerios',
  PAISES = 'paises',
  PERFIL = 'perfil',
  USUARIOS = 'usuarios',
  USUARIOS_SUPERVISOR = 'usuarios-supervisor',
  REGISTRAR_USUARIO = 'registrar-usuario',
  RESET_PASSWORD = '/reset-password',
  RUTA_NUEVA = 'ruta-nueva',
  SERVICIOS_Y_VIGILIAS = 'servicios-y-vigilias',
  SISTEMA = 'sistema',
  SITUACION_VISITA = 'situacion-visita',
  SOLICITUD_MULTIMEDIA = 'solicitud-multimedia',
  SOLICITUDES_MULTIMEDIA = 'solicitudes-multimedia',
  TIPO_DE_DOCUMENTO = 'tipo-de-documento',
  VER_INFORME = 'ver-informe',
  OPCION_DE_TRANSPORTE = 'opcion-de-transporte',
  GENERO = 'genero',
  TIPO_DE_ESTUDIO = 'tipo-de-estudio',
  RAZON_DE_SOLICITUD = 'razon-de-solicitud',
  PARENTESCO = 'parentesco',
}

export enum ROLES {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
  SUPERVISOR_LOCAL = 'SUPERVISOR_LOCAL',
  OBRERO = 'OBRERO',
  USUARIO = 'USUARIO',
  MULTIMEDIA = 'MULTIMEDIA',
}

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Inicio',
    icon: '',
    class: 'nav-small-cap',
    role: [ROLES.MULTIMEDIA, ROLES.OBRERO, ROLES.ADMINISTRADOR],
    extralink: true,
    submenu: [],
  },
  {
    path: '',
    title: 'Inicio',
    icon: 'fa fa-home',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.ADMINISTRADOR, ROLES.OBRERO, ROLES.MULTIMEDIA],
    submenu: [
      {
        path: RUTAS.INICIO,
        title: 'Inicio',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.PERFIL,
        title: 'Perfil',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Administración',
    icon: '',
    class: 'nav-small-cap',
    role: [ROLES.ADMINISTRADOR],
    extralink: true,
    submenu: [],
  },
  {
    path: '',
    title: 'Administración',
    icon: 'fa fa-lock',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.ADMINISTRADOR],
    submenu: [
      {
        path: RUTAS.USUARIOS,
        title: 'Usuarios',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.MINISTERIOS,
        title: 'Ministerios',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.INFORME,
        title: 'Informes',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.TIPO_DE_DOCUMENTO,
        title: 'Tipo de Documentos',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Configuración',
    icon: 'fa fa-lock',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.ADMINISTRADOR],
    submenu: [
      {
        path: RUTAS.OPCION_DE_TRANSPORTE,
        title: 'Opción de Transporte',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.GENERO,
        title: 'Género',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.TIPO_DE_ESTUDIO,
        title: 'Tipo de Estudio',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.RAZON_DE_SOLICITUD,
        title: 'Razon de Solicitud',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.PARENTESCO,
        title: 'Parentesco',
        icon: '',
        class: '',
        extralink: false,
        role: [],
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
    role: [ROLES.ADMINISTRADOR],
    submenu: [
      {
        path: RUTAS.USUARIOS,
        title: 'Feligreses',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
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
    role: [ROLES.ADMINISTRADOR],
    submenu: [
      {
        path: RUTAS.EVENTOS,
        title: 'Eventos',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: RUTAS.SOLICITUDES_MULTIMEDIA,
        title: 'Solicitud de Acceso',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: `${RUTAS.SOLICITUD_MULTIMEDIA}/nuevo`,
        title: 'Nueva Solicitud',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
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
    role: [ROLES.ADMINISTRADOR],
    submenu: [
      {
        path: RUTAS.CREAR_TIPO_ACTIVIDAD,
        title: 'Crear Actividad',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.CREAR_ESTATUS,
        title: 'Crear estatus',
        icon: '',
        class: '',
        extralink: false,
        role: [],
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
    role: [ROLES.ADMINISTRADOR],
    submenu: [
      {
        path: RUTAS.PAISES,
        title: 'Congregación - Paises',
        icon: '',
        class: 'menuCongregacion',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.CONGREGACIONES,
        title: 'Congregación - Ciudad',
        icon: '',
        class: 'menuCongregacion',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.CAMPOS,
        title: 'Congregación - Campo',
        icon: '',
        class: 'menuCongregacion',
        extralink: false,
        role: [],
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Supervisor',
    icon: '',
    class: 'nav-small-cap',
    role: [ROLES.SUPERVISOR],
    extralink: true,
    submenu: [],
  },
  {
    path: '',
    title: 'Supervisor',
    icon: 'fa fa-home',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.SUPERVISOR],
    submenu: [
      {
        path: RUTAS.USUARIOS_SUPERVISOR,
        title: 'Usuarios',
        icon: '',
        class: '',
        extralink: false,
        role: [],
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
    role: [ROLES.OBRERO],
    submenu: [],
  },
  {
    path: '',
    title: 'Crear Informe',
    icon: 'fa fa-book',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.OBRERO],
    submenu: [
      {
        path: RUTAS.INFORME,
        title: 'Generar Informe',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: RUTAS.VER_INFORME,
        title: 'Ver Informe',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Acceso CMAR Live',
    icon: 'fa fa-edit',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.OBRERO],
    submenu: [
      {
        path: `${RUTAS.SOLICITUD_MULTIMEDIA}/nuevo`,
        title: 'Solicitud de Acceso',
        icon: '',
        class: '',
        extralink: false,
        role: [],
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
    role: [ROLES.MULTIMEDIA],
    submenu: [],
  },
  {
    path: '',
    title: 'Multimedia LIVE',
    icon: 'fa fa-tv',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.MULTIMEDIA],
    submenu: [
      {
        path: RUTAS.SERVICIOS_Y_VIGILIAS,
        title: 'Servicios y Vigilias',
        icon: '',
        class: '',
        extralink: false,
        role: [],
        submenu: [],
      },
      {
        path: '',
        title: 'Biblioteca Multimedia',
        icon: '',
        class: 'has-arrow',
        extralink: false,
        role: [],
        submenu: [
          {
            path: RUTAS.BIBLIOTECA_SERVICIOS,
            title: 'Servicios',
            icon: '',
            class: '',
            extralink: false,
            role: [],
            submenu: [],
          },
          {
            path: RUTAS.BIBLIOTECA_VIGILIAS,
            title: 'Vigilias',
            icon: '',
            class: '',
            extralink: false,
            role: [],
            submenu: [],
          },
        ],
      },
    ],
  },
];
