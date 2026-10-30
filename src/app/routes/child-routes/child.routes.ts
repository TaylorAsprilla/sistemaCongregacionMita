import { Routes } from '@angular/router';
import { CamposComponent } from 'src/app/pages/administracion/campo/campos/campos.component';
import { CongregacionesComponent } from 'src/app/pages/administracion/congregacion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from 'src/app/pages/administracion/ministerios/ministerios/ministerios.component';
import { CrearActividadComponent } from 'src/app/pages/informes/crear-actividad/crear-actividad.component';
import { CrearCampoComponent } from 'src/app/pages/administracion/campo/crear-campo/crear-campo.component';
import { MensajesInformativosComponent } from 'src/app/pages/administracion/mensajesInformativos/mensajes-informativos/mensajes-informativos.component';
import { CrearMensajeInformativoComponent } from 'src/app/pages/administracion/mensajesInformativos/crear-mensaje-informativo/crear-mensaje-informativo.component';
import { CrearStatusComponent } from 'src/app/pages/informes/crear-status/crear-status.component';
import { InformeActividadesComponent } from 'src/app/pages/informes/informe-actividades/informe-actividades.component';
import { InformeDiezmosComponent } from 'src/app/pages/informes/informe-diezmos/informe-diezmos.component';
import { InformeLogrosComponent } from 'src/app/pages/informes/informe-logros/informe-logros.component';
import { InformeMetasComponent } from 'src/app/pages/informes/informe-metas/informe-metas.component';
import { InformeVisitasComponent } from 'src/app/pages/informes/informe-visitas/informe-visitas.component';
import { InformeAspectoEspiritualComponent } from 'src/app/pages/informes/informe-aspecto-espiritual/informe-aspecto-espiritual.component';
import { InformeAsuntoPendienteComponent } from 'src/app/pages/informes/informe-asunto-pendiente/informe-asunto-pendiente.component';
import { InformeComponent } from 'src/app/pages/informes/informe/informe.component';
import { VerInformeComponent } from 'src/app/pages/informes/ver-informe/ver-informe.component';
import { VerInformesPaisComponent } from 'src/app/pages/informes/ver-informes-pais/ver-informes-pais.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { ROLES, RUTAS } from '../menu-items';
import { InformeSituacionVisitaComponent } from 'src/app/pages/informes/informe-situacion-visita/informe-situacion-visita.component';
import { CrearCongregacionComponent } from 'src/app/pages/administracion/congregacion/crear-congregacion/crear-congregacion.component';
import { PaisesComponent } from 'src/app/pages/administracion/pais/paises/paises.component';
import { CrearPaisComponent } from 'src/app/pages/administracion/pais/crear-pais/crear-pais.component';
import { DivisasResolver } from 'src/app/resolvers/divisas/divisas.resolver';
import { SeccionInformeResolver } from 'src/app/resolvers/seccion-informe/seccion-informe.resolver';
import { NacionalidadResolver } from 'src/app/resolvers/nacionalidad/nacionalidad.resolver';
import { CrearSolicitudMultimediaComponent } from 'src/app/pages/multimedia/solicitudes-multimedia/crear-solicitud-multimedia/crear-solicitud-multimedia.component';
import { EstadoCivilResolver } from 'src/app/resolvers/estado-civil/estado-civil.resolver';
import { GeneroResolver } from 'src/app/resolvers/genero/genero.resolver';
import { RolCasaResolver } from 'src/app/resolvers/rol-casa/rol-casa.resolver';
import { GradoAcademicoResolver } from 'src/app/resolvers/grado-academico/grado-academico.resolver';
import { CongregacionResolver } from 'src/app/resolvers/congregacion/congregacion.resolver';
import { TipoMiembroResolver } from 'src/app/resolvers/tipo-miembro/tipo-miembro.resolver';
import { MinisterioResolver } from 'src/app/resolvers/ministerio/ministerio.resolver';
import { VoluntariadoResolver } from 'src/app/resolvers/voluntariado/voluntariado.resolver';
import { PaisResolver } from 'src/app/resolvers/pais/pais.resolver';
import { CampoResolver } from 'src/app/resolvers/campo/campo.resolver';
import { RazonSolicitudResolver } from 'src/app/resolvers/razon-solicitud/razon-solicitud.resolver';
import { ServiciosComponent } from 'src/app/pages/multimedia/biblioteca-multimedia/servicios/servicios.component';
import { AgregarBibliotecaComponent } from 'src/app/pages/multimedia/biblioteca-multimedia/agregar-biblioteca/agregar-biblioteca.component';
import { ObreroResolver } from 'src/app/resolvers/obrero/obrero.resolver';
import { TiposDeDocumentosComponent } from 'src/app/pages/administracion/tipo-de-documento/tipos-de-documentos/tipos-de-documentos.component';
import { CrearTipoDocumentoComponent } from 'src/app/pages/administracion/tipo-de-documento/crear-tipo-documento/crear-tipo-documento.component';
import { DocumentoResolver } from 'src/app/resolvers/tipo-documento/documento.resolver';
import { TipoActividadEconomicaComponent } from 'src/app/pages/informes/tipo-actividad-economica/tipo-actividad-economica.component';
import { ActividadEconomicaComponent } from 'src/app/pages/informes/actividad-economica/actividad-economica.component';
import { TipoEstudioResolver } from 'src/app/resolvers/tipo-estudio/tipo-estudio.resolver';
import { OpcionTransporteResolver } from 'src/app/resolvers/opcion-transporte/opcion-transporte.resolver';
import { ParentescoResolver } from 'src/app/resolvers/parentesco/parentesco.resolver';
import { ConfigurarEventosComponent } from 'src/app/pages/multimedia/eventos-multimedia/configurar-eventos/configurar-eventos.component';
import { EventosBibliotecaComponent } from 'src/app/pages/multimedia/eventos-multimedia/eventos/eventos.component';
import { RolesGuard } from 'src/app/core/guards/roles/roles.guard';
import { OpcionDeTransporteComponent } from 'src/app/pages/configuracion/opcion-de-transporte/opcion-de-transporte.component';
import { GeneroComponent } from 'src/app/pages/configuracion/genero/genero.component';
import { TipoDeEstudioComponent } from 'src/app/pages/configuracion/tipo-de-estudio/tipo-de-estudio.component';
import { RazonDeSolicitudComponent } from 'src/app/pages/configuracion/razon-de-solicitud/razon-de-solicitud.component';
import { ParentescoComponent } from 'src/app/pages/configuracion/parentesco/parentesco.component';
import { UsuarioResolver } from 'src/app/resolvers/getUsuario/get-usuario.resolver';
import { CrearMinisterioComponent } from 'src/app/pages/administracion/ministerios/crear-ministerio/crear-ministerio.component';
import { EstadoCivilComponent } from 'src/app/pages/configuracion/estado-civil/estado-civil.component';
import { GradoAlcanzadoComponent } from 'src/app/pages/configuracion/grado-alcanzado/grado-alcanzado.component';
import { RolEnCasaComponent } from 'src/app/pages/configuracion/rol-en-casa/rol-en-casa.component';
import { CategoriaProfesionComponent } from 'src/app/pages/configuracion/categoria-profesion/categoria-profesion.component';
import { VoluntarioComponent } from 'src/app/pages/configuracion/voluntario/voluntario.component';
import { SolicitudMultimediaComponent } from 'src/app/pages/multimedia/solicitudes-multimedia/solicitud-multimedia/solicitud-multimedia.component';
import { EventosEnVivoComponent } from 'src/app/pages/multimedia/eventos-multimedia/eventos-en-vivo/eventos-en-vivo.component';
import InicioComponent from 'src/app/pages/inicio/inicio.component';
import { SolicitudesPendienteComponent } from 'src/app/pages/multimedia/solicitudes-multimedia/solicitudes-pendiente/solicitudes-pendiente.component';
import { PerfilOptimizadoResolver } from 'src/app/resolvers/perfil-optimizado/perfil-optimizado.resolver';
import { SesionesActivasComponent } from 'src/app/pages/sesiones-activas/sesiones-activas.component';

export const childRoutes: Routes = [
  {
    path: 'inicio',
    title: 'Inicio',
    component: InicioComponent,
    data: { titulo: 'Censo' },
  },
  {
    path: RUTAS.SESIONES_ACTIVAS,
    title: 'Sesiones activas',
    component: SesionesActivasComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Sesiones Activas',
      role: [ROLES.ADMINISTRADOR, ROLES.ADMINISTRADOR_MULTIMEDIA],
    },
  },

  // Administración
  {
    path: RUTAS.USUARIOS,
    title: 'Usuarios registrados',
    loadComponent: () => import('src/app/pages/administracion/usuario/usuarios/usuarios.component'),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Usuarios Registrados',
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
    },
  },
  {
    path: RUTAS.AYUDA,
    title: 'Ayuda',
    loadComponent: () => import('src/app/pages/ayuda/ayuda.component'),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Ayuda',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_PAIS,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
        ROLES.ADMINISTRADOR_MULTIMEDIA,
        ROLES.COMITE_RECTOR,
        ROLES.ASISTENTE_OOTS,
      ],
    },
  },
  {
    path: `${RUTAS.USUARIOS}/:id`,
    title: 'Registro de usuario',
    loadComponent: () => import('src/app/pages/administracion/usuario/registrar-usuario/registrar-usuario.component'),
    canActivate: [RolesGuard],
    data: {
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.ADMINISTRADOR_PAIS,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_PAIS,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
        ROLES.ASISTENTE_OOTS,
        ROLES.AYUDANTE,
      ],
    },
    resolve: {
      nacionalidad: NacionalidadResolver,
      estadoCivil: EstadoCivilResolver,
      genero: GeneroResolver,
      rolCasa: RolCasaResolver,
      gradoAcademico: GradoAcademicoResolver,
      congregacion: CongregacionResolver,
      tipoMiembro: TipoMiembroResolver,
      ministerio: MinisterioResolver,
      voluntariado: VoluntariadoResolver,
      pais: PaisResolver,
      campo: CampoResolver,
      tipoDocumento: DocumentoResolver,
      usuario: UsuarioResolver,
    },
  },
  {
    path: RUTAS.USUARIOS_AYUDANTE,
    title: 'Censo de ayudante',
    loadComponent: () => import('src/app/pages/ayudantes/censo-ayudante/censo-ayudante.component'),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Censo Ayudante',
      role: [ROLES.AYUDANTE],
    },
  },
  {
    path: RUTAS.CENSO,
    title: 'Censo',
    loadComponent: () => import('src/app/pages/obreros/censo-obrero/censo-obrero.component'),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Censo',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.ADMINISTRADOR_PAIS,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_PAIS,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
      ],
    },
  },
  {
    path: RUTAS.PERMISOS,
    title: 'Asignar permisos',
    loadComponent: () => import('src/app/pages/administracion/asignar-permisos/asignar-permisos.component'),
  },
  {
    path: RUTAS.RESET_PASSWORD_USUARIO,
    title: 'Cambiar contraseña de usuario',
    loadComponent: () =>
      import('src/app/pages/administracion/usuario/cambiar-password-usuario/cambiar-password-usuario.component'),
  },

  {
    path: RUTAS.USUARIOS_SUPERVISOR,
    title: 'Censo de supervisión',
    loadComponent: () => import('src/app/pages/obreros/censo-supervisor/censo-supervisor.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.OBRERO_PAIS],
    },
  },

  {
    path: `${RUTAS.CONFIRMAR_REGISTRO}/:id`,
    title: 'Confirmar registro',
    loadComponent: () =>
      import('src/app/pages/administracion/usuario/confirmacion-de-registro/confirmacion-de-registro.component'),
  },

  {
    loadComponent: () => import('src/app/pages/administracion/reportes/reporte-general/reporte-general.component'),
    canActivate: [RolesGuard],
    path: RUTAS.REPORTE_GENERAL,
    title: 'Reporte general del censo',
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },

  {
    loadComponent: () =>
      import('src/app/pages/administracion/reportes/reporte-congregacion/reporte-congregacion.component'),
    canActivate: [RolesGuard],
    path: RUTAS.REPORTE_CONGREGACION,
    title: 'Reporte por congregación',
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },

  {
    loadComponent: () =>
      import('src/app/pages/administracion/reportes/dashboard-supervision/dashboard-supervision.component').then(
        (m) => m.DashboardSupervisionComponent,
      ),
    canActivate: [RolesGuard],
    path: RUTAS.DASHBOARD_SUPERVISION,
    title: 'Panel de supervisión',
    data: {
      role: [ROLES.ADMINISTRADOR],
    },
  },
  {
    path: RUTAS.MINISTERIOS,
    title: 'Ministerios',
    component: MinisteriosComponent,
  },
  {
    path: `${RUTAS.MINISTERIOS}/:id`,
    title: 'Configurar ministerio',
    component: CrearMinisterioComponent,
    resolve: { ministerio: MinisterioResolver },
    data: { titulo: 'Crear Ministerio' },
  },

  {
    path: RUTAS.PAISES,
    title: 'Países',
    component: PaisesComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Paises',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.ADMINISTRADOR_PAIS,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.ASISTENTE_OOTS,
      ],
    },
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver },
  },
  {
    path: `${RUTAS.PAISES}/:id`,
    title: 'Configurar país',
    component: CrearPaisComponent,
    canActivate: [RolesGuard],
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver },
    data: {
      titulo: 'Crear Pais',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.ADMINISTRADOR_PAIS,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.ASISTENTE_OOTS,
      ],
    },
  },
  {
    path: RUTAS.CONGREGACIONES,
    title: 'Congregaciones',
    component: CongregacionesComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Congregaciones',
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
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver, pais: PaisResolver },
  },
  {
    path: `${RUTAS.CONGREGACIONES}/:id`,
    title: 'Configurar congregación',
    component: CrearCongregacionComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Congregaciones',
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
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver, pais: PaisResolver },
  },
  {
    path: RUTAS.CAMPOS,
    title: 'Campos',
    component: CamposComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Campos',
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
    resolve: { obrero: ObreroResolver, congregacion: CongregacionResolver, pais: PaisResolver },
  },
  {
    path: `${RUTAS.CAMPOS}/:id`,
    title: 'Configurar campo',
    component: CrearCampoComponent,
    data: {
      titulo: 'Campos',
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
    resolve: { obrero: ObreroResolver, congregacion: CongregacionResolver, pais: PaisResolver },
  },
  {
    path: RUTAS.MENSAJES_INFORMATIVOS,
    title: 'Mensajes informativos',
    component: MensajesInformativosComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Mensajes Informativos',
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },
  {
    path: `${RUTAS.MENSAJES_INFORMATIVOS}/:id`,
    title: 'Configurar mensaje informativo',
    component: CrearMensajeInformativoComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Mensajes Informativos',
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },
  {
    path: RUTAS.TIPO_DE_DOCUMENTO,
    title: 'Tipos de documento',
    component: TiposDeDocumentosComponent,
    resolve: { pais: PaisResolver },
  },
  {
    path: `${RUTAS.TIPO_DE_DOCUMENTO}/:id`,
    title: 'Configurar tipo de documento',
    component: CrearTipoDocumentoComponent,
    resolve: { pais: PaisResolver },
  },
  {
    path: RUTAS.CREAR_TIPO_ACTIVIDAD_ECONOMICA,
    title: 'Tipos de actividad económica',
    component: TipoActividadEconomicaComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Tipos de Actividad Económica',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_PAIS,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
        ROLES.ASISTENTE_OOTS,
        ROLES.PRUEBA_INFORMES,
      ],
    },
  },
  {
    path: RUTAS.INFORME_ACTIVIDAD_ECONOMICA,
    title: 'Actividades económicas',
    component: ActividadEconomicaComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Actividades Económicas',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_PAIS,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
        ROLES.PRUEBA_INFORMES,
      ],
    },
  },

  // Configuracion
  {
    path: RUTAS.OPCION_DE_TRANSPORTE,
    title: 'Opciones de transporte',
    component: OpcionDeTransporteComponent,
  },
  {
    path: RUTAS.GENERO,
    title: 'Géneros',
    component: GeneroComponent,
  },
  {
    path: RUTAS.ESTADO_CIVIL,
    title: 'Estados civiles',
    component: EstadoCivilComponent,
  },
  {
    path: RUTAS.GRADO_ALCANZADO,
    title: 'Grados académicos',
    component: GradoAlcanzadoComponent,
  },
  {
    path: RUTAS.ROL_EN_CASA,
    title: 'Roles en el hogar',
    component: RolEnCasaComponent,
  },
  {
    path: RUTAS.CATEGORIA_PROFESION,
    title: 'Categorías de profesión',
    component: CategoriaProfesionComponent,
  },
  {
    path: RUTAS.VOLUNTARIO,
    title: 'Voluntariado',
    component: VoluntarioComponent,
  },
  {
    path: RUTAS.TIPO_DE_ESTUDIO,
    title: 'Tipos de estudio',
    component: TipoDeEstudioComponent,
  },
  {
    path: RUTAS.RAZON_DE_SOLICITUD,
    title: 'Razones de solicitud',
    component: RazonDeSolicitudComponent,
  },
  {
    path: RUTAS.PARENTESCO,
    title: 'Parentescos',
    component: ParentescoComponent,
  },

  {
    path: RUTAS.GENERAR_QR,
    title: 'Generar código QR',
    loadComponent: () => import('src/app/pages/accesosQr/qr-code-generator/qr-code-generator.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS, ROLES.COMITE_RECTOR],
    },
  },

  {
    path: RUTAS.LISTAR_ACCESOS_QR,
    title: 'Historial de accesos QR',
    loadComponent: () => import('src/app/pages/accesosQr/listado-accesos-qr/listado-accesos-qr.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS, ROLES.COMITE_RECTOR],
    },
  },

  {
    path: RUTAS.GRUPO_GEMELOS,
    title: 'Grupos de gemelos',
    loadComponent: () => import('src/app/pages/administracion/grupoDeGemelos/grupo-gemelos/grupo-gemelos.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },

  {
    path: RUTAS.VER_GRUPO_DE_GEMELOS,
    title: 'Detalle del grupo de gemelos',
    loadComponent: () =>
      import('src/app/pages/administracion/grupoDeGemelos/ver-grupo-de-gemelos/ver-grupo-de-gemelos.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },

  // Perfil - OPTIMIZADO: Usa un único resolver con caché en lugar de 13 resolvers individuales
  {
    path: `${RUTAS.PERFIL}/:id`,
    title: 'Perfil de usuario',
    component: PerfilComponent,
    resolve: {
      perfilData: PerfilOptimizadoResolver,
    },
  },
  // Informes
  {
    path: RUTAS.CREAR_TIPO_ACTIVIDAD,
    title: 'Tipos de actividad eclesiástica',
    component: CrearActividadComponent,
    resolve: { seccionInforme: SeccionInformeResolver },
  },
  {
    path: RUTAS.CREAR_CAMPO,
    title: 'Crear campo',
    component: CrearCampoComponent,
  },

  {
    path: RUTAS.CREAR_PAIS,
    title: 'Crear país',
    component: CrearPaisComponent,
  },
  {
    path: RUTAS.CREAR_ESTATUS,
    title: 'Estados de informe',
    component: CrearStatusComponent,
  },
  {
    path: RUTAS.INFORME_ACTIVIDADES_ECLESIASTICAS,
    title: 'Informe de actividades eclesiásticas',
    component: InformeActividadesComponent,
  },
  {
    path: RUTAS.INFORME_DIEZMOS,
    title: 'Informe de diezmos',
    component: InformeDiezmosComponent,
  },
  {
    path: RUTAS.INFORME_LOGROS,
    title: 'Informe de logros',
    component: InformeLogrosComponent,
  },
  {
    path: RUTAS.METAS,
    title: 'Informe de metas',
    component: InformeMetasComponent,
  },
  {
    path: RUTAS.INFORME_VISITAS,
    title: 'Informe de visitas',
    component: InformeVisitasComponent,
  },
  {
    path: RUTAS.SITUACION_VISITA,
    title: 'Situaciones de visita',
    component: InformeSituacionVisitaComponent,
  },
  {
    path: RUTAS.INFORME_ASPECTO_ESPIRITUAL,
    title: 'Informe del aspecto espiritual',
    component: InformeAspectoEspiritualComponent,
  },
  {
    path: RUTAS.ASUNTO_PENDIENTE,
    title: 'Asuntos pendientes',
    component: InformeAsuntoPendienteComponent,
  },
  // informes pagina principal
  {
    path: RUTAS.INFORME,
    title: 'Informe de congregación',
    component: InformeComponent,
  },
  {
    path: RUTAS.VER_INFORME,
    title: 'Consultar informe',
    component: VerInformeComponent,
  },
  {
    path: RUTAS.MIS_INFORMES,
    title: 'Mis informes anteriores',
    loadComponent: () =>
      import('src/app/pages/informes/mis-informes/mis-informes.component').then((m) => m.MisInformesComponent),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Mis informes anteriores',
      role: [ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
    },
  },
  {
    path: `${RUTAS.VER_INFORME}/:id`,
    title: 'Detalle del informe',
    component: VerInformeComponent,
  },
  {
    path: RUTAS.VER_INFORMES_PAIS,
    title: 'Informes del país',
    component: VerInformesPaisComponent,
    canActivate: [RolesGuard],
    resolve: {
      congregaciones: CongregacionResolver,
      campos: CampoResolver,
    },
    data: {
      titulo: 'Ver Informes del País',
      supervisionPais: true,
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.OBRERO_PAIS],
    },
  },
  {
    path: `${RUTAS.SOLICITUD_MULTIMEDIA}/:id`,
    title: 'Solicitud de acceso a servicios en línea',
    component: CrearSolicitudMultimediaComponent,
    resolve: {
      nacionalidad: NacionalidadResolver,
      congregacion: CongregacionResolver,
      pais: PaisResolver,
      razonSolicitud: RazonSolicitudResolver,
      tipoEstudio: TipoEstudioResolver,
      opcionTransporte: OpcionTransporteResolver,
      parentesco: ParentescoResolver,
    },
  },
  {
    path: RUTAS.SOLICITUDES_MULTIMEDIA,
    title: 'Solicitudes de acceso',
    component: SolicitudMultimediaComponent,
    resolve: {
      tipoMiembro: TipoMiembroResolver,
      nacionalidad: NacionalidadResolver,
    },
  },
  {
    path: RUTAS.SOLICITUDES_MULTIMEDIA_PENDIENTES,
    title: 'Solicitudes de acceso pendientes',
    component: SolicitudesPendienteComponent,
    resolve: {
      tipoMiembro: TipoMiembroResolver,
      nacionalidad: NacionalidadResolver,
    },
  },
  {
    path: `${RUTAS.EVENTOS}/:id`,
    title: 'Configurar evento multimedia',
    component: ConfigurarEventosComponent,
  },
  {
    path: RUTAS.EVENTOS,
    title: 'Eventos multimedia',
    component: EventosBibliotecaComponent,
  },
  {
    path: `${RUTAS.CONFIGURAR_SERVICIOS_Y_VIGILIAS}/:id`,
    title: 'Editar servicio o vigilia',
    component: ConfigurarEventosComponent,
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ADMINISTRADOR_MULTIMEDIA, ROLES.ASISTENTE_OOTS],
    },
  },
  {
    path: RUTAS.CONFIGURAR_SERVICIOS_Y_VIGILIAS,
    title: 'Configurar servicios y vigilias',
    component: ConfigurarEventosComponent,
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ADMINISTRADOR_MULTIMEDIA, ROLES.ASISTENTE_OOTS],
    },
  },
  {
    path: RUTAS.BIBLIOTECA_SERVICIOS,
    title: 'Biblioteca de servicios',
    component: ServiciosComponent,
  },
  {
    path: RUTAS.AGREGAR_BIBLIOTECA,
    title: 'Agregar a la biblioteca',
    component: AgregarBibliotecaComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Agregar a Biblioteca',
      role: [ROLES.ADMINISTRADOR, ROLES.ADMINISTRADOR_MULTIMEDIA, ROLES.ASISTENTE_OOTS],
    },
  },

  {
    path: RUTAS.EVENTOS_EN_VIVO,
    title: 'Eventos en vivo',
    component: EventosEnVivoComponent,
    canActivate: [RolesGuard],
    data: {
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.ADMINISTRADOR_PAIS,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_PAIS,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
      ],
    },
  },
  {
    path: RUTAS.DASHBOARD_OBRERO,
    title: 'Panel del obrero',
    loadComponent: () =>
      import('src/app/pages/dashboard-obrero/dashboard-obrero.component').then((m) => m.DashboardObreroComponent),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Dashboard de Obrero',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.ADMINISTRADOR_PAIS,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_PAIS,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
      ],
    },
  },
  {
    path: RUTAS.DASHBOARD_INFORMES_OBRERO,
    title: 'Panel de informes de la congregación',
    loadComponent: () =>
      import(
        'src/app/pages/administracion/reportes/dashboard-supervision/dashboard-supervision.component'
      ).then((m) => m.DashboardSupervisionComponent),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Dashboard de informes de la congregación',
      supervisionObrero: true,
      role: [ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
    },
  },
];

export default childRoutes;
