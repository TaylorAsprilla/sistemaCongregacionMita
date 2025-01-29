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
  CENSO = 'censo',
  EVENTOS = 'eventos',
  EVENTOS_EN_VIVO = 'eventos-en-vivo',
  HOME = '/#/sistema/inicio',
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
  USUARIOS_AYUDANTE = 'usuarios-ayudante',
  USUARIOS_SUPERVISOR = 'usuarios-supervisor',
  RECUPERAR_CUENTA = '/recuperar-cuenta',
  REGISTRAR_USUARIO = 'registrar-usuario',
  REPORTE_GENERAL = 'reporte-general',
  RESET_PASSWORD = '/reset-password',
  RESET_PASSWORD_USUARIO = 'reset-password-usuario',
  RUTA_NUEVA = 'ruta-nueva',
  SERVICIOS_Y_VIGILIAS = 'servicios-y-vigilias',
  SISTEMA = 'sistema',
  SITUACION_VISITA = 'situacion-visita',
  SOLICITUD = 'solicitud',
  SOLICITUD_MULTIMEDIA = 'solicitud-multimedia',
  SOLICITUDES_MULTIMEDIA = 'solicitudes-multimedia',
  SOLICITUDES_MULTIMEDIA_PENDIENTES = 'solicitudes-multimedia-pendientes',
  TIPO_DE_DOCUMENTO = 'tipo-de-documento',
  VER_INFORME = 'ver-informe',
  OPCION_DE_TRANSPORTE = 'opcion-de-transporte',
  GENERO = 'genero',
  ESTADO_CIVIL = 'estado_civil',
  GRADO_ALCANZADO = 'grado_alcanzado',
  ROL_EN_CASA = 'rol_en_casa',
  VOLUNTARIO = 'voluntario',
  TIPO_DE_ESTUDIO = 'tipo-de-estudio',
  RAZON_DE_SOLICITUD = 'razon-de-solicitud',
  PARENTESCO = 'parentesco',
  PERMISOS = 'permisos',
}

export enum ROLES {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
  SUPERVISOR_LOCAL = 'SUPERVISOR LOCAL',
  OBRERO_CIUDAD = 'OBRERO CIUDAD',
  OBRERO_CAMPO = 'OBRERO CAMPO',
  USUARIO = 'USUARIO',
  MULTIMEDIA = 'MULTIMEDIA',
  ADMINISTRADOR_MULTIMEDIA = 'ADMINISTRADOR MULTIMEDIA',
  ASISTENTE_OOTS = 'ASISTENTE OOTS',
  AYUDANTE = 'AYUDANTE',
  APROBADOR_MULTIMEDIA = 'APROBADOR MULTIMEDIA',
}

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Inicio',
    icon: '',
    class: 'nav-small-cap',
    role: [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.MULTIMEDIA,
      ROLES.ADMINISTRADOR_MULTIMEDIA,
      ROLES.ASISTENTE_OOTS,
      ROLES.AYUDANTE,
    ],
    extralink: true,
    submenu: [],
  },
  {
    path: RUTAS.INICIO,
    title: 'Inicio',
    icon: 'fa fa-home',
    class: 'has-arrow',
    extralink: false,
    role: [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.MULTIMEDIA,
      ROLES.ADMINISTRADOR_MULTIMEDIA,
      ROLES.ASISTENTE_OOTS,
      ROLES.AYUDANTE,
    ],
    submenu: [],
  },
  {
    path: '',
    title: 'Administración',
    icon: '',
    class: 'nav-small-cap',
    role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    extralink: true,
    submenu: [],
  },
  {
    path: '',
    title: 'Administración',
    icon: 'fa fa-lock',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    submenu: [
      {
        path: RUTAS.USUARIOS,
        title: 'Feligreses General',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
        submenu: [],
      },
      {
        path: RUTAS.REPORTE_GENERAL,
        title: 'Reporte General',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
        submenu: [],
      },

      {
        path: RUTAS.INFORME,
        title: 'Informes',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: RUTAS.TIPO_DE_DOCUMENTO,
        title: 'Tipo de Documentos',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: RUTAS.PERMISOS,
        title: 'Asignar Permisos',
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
    title: 'Configuración',
    icon: 'fa fa-gear',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.ADMINISTRADOR],
    submenu: [
      {
        path: RUTAS.MINISTERIOS,
        title: 'Ministerios',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
        submenu: [],
      },
      {
        path: RUTAS.GENERO,
        title: 'Género',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: RUTAS.ESTADO_CIVIL,
        title: 'Estado Civil',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: RUTAS.GRADO_ALCANZADO,
        title: 'Grado Alcanzado',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: RUTAS.ROL_EN_CASA,
        title: 'Rol en Casa',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: RUTAS.VOLUNTARIO,
        title: 'Voluntario',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: '',
        title: 'Solicitud Multimedia',
        icon: '',
        class: 'has-arrow',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [
          {
            path: RUTAS.TIPO_DE_ESTUDIO,
            title: 'Tipo de Estudio',
            icon: '',
            class: '',
            extralink: false,
            role: [ROLES.ADMINISTRADOR],
            submenu: [],
          },
          {
            path: RUTAS.RAZON_DE_SOLICITUD,
            title: 'Razon de Solicitud',
            icon: '',
            class: '',
            extralink: false,
            role: [ROLES.ADMINISTRADOR],
            submenu: [],
          },
          {
            path: RUTAS.PARENTESCO,
            title: 'Parentesco',
            icon: '',
            class: '',
            extralink: false,
            role: [ROLES.ADMINISTRADOR],
            submenu: [],
          },
          {
            path: RUTAS.OPCION_DE_TRANSPORTE,
            title: 'Opción de Transporte',
            icon: '',
            class: '',
            extralink: false,
            role: [ROLES.ADMINISTRADOR],
            submenu: [],
          },
        ],
      },
    ],
  },
  {
    path: RUTAS.CENSO,
    title: 'Censo',
    icon: 'fa fa-users',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.ADMINISTRADOR, ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
    submenu: [],
  },
  {
    path: '',
    title: 'Multimedia',
    icon: 'fa fa-tv',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.ADMINISTRADOR, ROLES.ADMINISTRADOR_MULTIMEDIA, ROLES.ASISTENTE_OOTS],
    submenu: [
      {
        path: RUTAS.EVENTOS,
        title: 'Eventos',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.ADMINISTRADOR_MULTIMEDIA, ROLES.ASISTENTE_OOTS],
        submenu: [],
      },
      {
        path: RUTAS.SOLICITUDES_MULTIMEDIA,
        title: 'Solicitudes de Acceso',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.ADMINISTRADOR_MULTIMEDIA, ROLES.ASISTENTE_OOTS],
        submenu: [],
      },
      {
        path: `${RUTAS.SOLICITUD_MULTIMEDIA}/nuevo`,
        title: 'Nueva Solicitud',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.ADMINISTRADOR_MULTIMEDIA, ROLES.ASISTENTE_OOTS],
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
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL],
    submenu: [
      {
        path: RUTAS.CREAR_TIPO_ACTIVIDAD,
        title: 'Crear Actividad',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL],
        submenu: [],
      },
      {
        path: RUTAS.CREAR_ESTATUS,
        title: 'Crear estatus',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL],
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
    role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
    submenu: [
      {
        path: RUTAS.PAISES,
        title: 'Congregación - Paises',
        icon: '',
        class: 'menuCongregacion',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
        submenu: [],
      },
      {
        path: RUTAS.CONGREGACIONES,
        title: 'Congregación - Ciudad',
        icon: '',
        class: 'menuCongregacion',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
        submenu: [],
      },
      {
        path: RUTAS.CAMPOS,
        title: 'Congregación - Campo',
        icon: '',
        class: 'menuCongregacion',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'Ayudante',
    icon: '',
    class: 'nav-small-cap',
    role: [ROLES.AYUDANTE],
    extralink: true,
    submenu: [],
  },
  {
    path: RUTAS.USUARIOS_AYUDANTE,
    title: 'Censo Ayudante',
    icon: 'fa fa-users',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.AYUDANTE],
    submenu: [],
  },
  {
    path: '',
    title: 'Supervisor',
    icon: '',
    class: 'nav-small-cap',
    role: [ROLES.SUPERVISOR, ROLES.ADMINISTRADOR],
    extralink: true,
    submenu: [],
  },
  {
    path: RUTAS.USUARIOS_SUPERVISOR,
    title: 'Censo Supervisor',
    icon: 'fa fa-home',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.SUPERVISOR, ROLES.ADMINISTRADOR],
    submenu: [],
  },
  {
    path: '',
    title: 'Infomes',
    icon: '',
    class: 'nav-small-cap',
    extralink: true,
    role: [ROLES.ADMINISTRADOR],
    submenu: [],
  },
  {
    path: '',
    title: 'Crear Informe',
    icon: 'fa fa-book',
    class: 'has-arrow',
    extralink: false,
    role: [ROLES.ADMINISTRADOR],
    submenu: [
      {
        path: RUTAS.INFORME,
        title: 'Generar Informe',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR],
        submenu: [],
      },
      {
        path: RUTAS.VER_INFORME,
        title: 'Ver Informe',
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
    title: 'Live',
    icon: '',
    class: 'nav-small-cap',
    extralink: true,
    role: [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.ADMINISTRADOR_MULTIMEDIA,
      ROLES.MULTIMEDIA,
    ],
    submenu: [],
  },
  {
    path: '',
    title: 'Multimedia LIVE',
    icon: 'fa fa-tv',
    class: 'has-arrow',
    extralink: false,
    role: [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.ADMINISTRADOR_MULTIMEDIA,
      ROLES.MULTIMEDIA,
    ],
    submenu: [
      {
        path: RUTAS.BIBLIOTECA_SERVICIOS,
        title: 'Biblioteca Multimedia',
        icon: '',
        class: 'has-arrow',
        extralink: false,
        role: [
          ROLES.ADMINISTRADOR,
          ROLES.SUPERVISOR,
          ROLES.SUPERVISOR_LOCAL,
          ROLES.OBRERO_CIUDAD,
          ROLES.OBRERO_CAMPO,
          ROLES.ADMINISTRADOR_MULTIMEDIA,
          ROLES.MULTIMEDIA,
          ROLES.ASISTENTE_OOTS,
        ],
        submenu: [],
      },
      {
        path: `${RUTAS.SOLICITUD_MULTIMEDIA}/nuevo`,
        title: 'Nueva Solicitud',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.OBRERO_CIUDAD, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL],
        submenu: [],
      },
      {
        path: RUTAS.SOLICITUDES_MULTIMEDIA_PENDIENTES,
        title: 'Solicitudes de Acceso',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
        submenu: [],
      },
      {
        path: RUTAS.EVENTOS_EN_VIVO,
        title: 'Servicios en Vivo',
        icon: '',
        class: '',
        extralink: false,
        role: [ROLES.ADMINISTRADOR, ROLES.OBRERO_CIUDAD, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL],
        submenu: [],
      },
    ],
  },
];
