import { Routes } from '@angular/router';
import { CamposComponent } from 'src/app/pages/administracion/campo/campos/campos.component';
import { CongregacionesComponent } from 'src/app/pages/administracion/congregacion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from 'src/app/pages/administracion/ministerios/ministerios/ministerios.component';
import { CrearActividadComponent } from 'src/app/pages/informes/crear-actividad/crear-actividad.component';
import { CrearCampoComponent } from 'src/app/pages/administracion/campo/crear-campo/crear-campo.component';
import { CrearStatusComponent } from 'src/app/pages/informes/crear-status/crear-status.component';
import { InformeActividadesComponent } from 'src/app/pages/informes/informe-actividades/informe-actividades.component';
import { InformeDiezmosComponent } from 'src/app/pages/informes/informe-diezmos/informe-diezmos.component';
import { InformeLogrosComponent } from 'src/app/pages/informes/informe-logros/informe-logros.component';
import { InformeMetasComponent } from 'src/app/pages/informes/informe-metas/informe-metas.component';
import { InformeVisitasComponent } from 'src/app/pages/informes/informe-visitas/informe-visitas.component';
import { InformeComponent } from 'src/app/pages/informes/informe/informe.component';
import { VerInformeComponent } from 'src/app/pages/informes/ver-informe/ver-informe.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { ROLES, RUTAS } from '../menu-items';
import { InformeSituacionVisitaComponent } from 'src/app/pages/informes/informe-situacion-visita/informe-situacion-visita.component';
import { InformesResolver } from 'src/app/resolvers/informes/informes.resolver';
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
import { EventosComponent } from 'src/app/pages/multimedia/eventos-multimedia/eventos/eventos.component';
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
import { VoluntarioComponent } from 'src/app/pages/configuracion/voluntario/voluntario.component';
import { SolicitudMultimediaComponent } from 'src/app/pages/multimedia/solicitudes-multimedia/solicitud-multimedia/solicitud-multimedia.component';
import { EventosEnVivoComponent } from 'src/app/pages/multimedia/eventos-multimedia/eventos-en-vivo/eventos-en-vivo.component';
import InicioComponent from 'src/app/pages/inicio/inicio.component';
import { SolicitudesPendienteComponent } from 'src/app/pages/multimedia/solicitudes-multimedia/solicitudes-pendiente/solicitudes-pendiente.component';

export const childRoutes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    data: { titulo: 'Censo' },
  },

  // Administración
  {
    path: RUTAS.USUARIOS,
    loadComponent: () => import('src/app/pages/administracion/usuario/usuarios/usuarios.component'),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Usuarios Registrados',
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
    },
  },
  {
    path: RUTAS.AYUDA,
    loadComponent: () => import('src/app/pages/ayuda/ayuda.component'),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Ayuda',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_CIUDAD,
        ROLES.ADMINISTRADOR_MULTIMEDIA,
        ROLES.COMITE_RECTOR,
        ROLES.ASISTENTE_OOTS,
      ],
    },
  },
  {
    path: `${RUTAS.USUARIOS}/:id`,
    loadComponent: () => import('src/app/pages/administracion/usuario/registrar-usuario/registrar-usuario.component'),
    canActivate: [RolesGuard],
    data: {
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
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
    loadComponent: () => import('src/app/pages/ayudantes/censo-ayudante/censo-ayudante.component'),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Censo Ayudante',
      role: [ROLES.AYUDANTE],
    },
  },
  {
    path: RUTAS.CENSO,
    loadComponent: () => import('src/app/pages/obreros/censo-obrero/censo-obrero.component'),
    canActivate: [RolesGuard],
    data: {
      titulo: 'Censo',
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
    },
  },
  {
    path: RUTAS.PERMISOS,
    loadComponent: () => import('src/app/pages/administracion/asignar-permisos/asignar-permisos.component'),
  },
  {
    path: RUTAS.RESET_PASSWORD_USUARIO,
    loadComponent: () =>
      import('src/app/pages/administracion/usuario/cambiar-password-usuario/cambiar-password-usuario.component'),
  },

  {
    path: RUTAS.USUARIOS_SUPERVISOR,
    loadComponent: () => import('src/app/pages/obreros/censo-supervisor/censo-supervisor.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL],
    },
  },

  {
    path: `${RUTAS.CONFIRMAR_REGISTRO}/:id`,
    loadComponent: () =>
      import('src/app/pages/administracion/usuario/confirmacion-de-registro/confirmacion-de-registro.component'),
  },

  {
    loadComponent: () => import('src/app/pages/administracion/reportes/reporte-general/reporte-general.component'),
    canActivate: [RolesGuard],
    path: RUTAS.REPORTE_GENERAL,
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },

  {
    loadComponent: () =>
      import('src/app/pages/administracion/reportes/reporte-congregacion/reporte-congregacion.component'),
    canActivate: [RolesGuard],
    path: RUTAS.REPORTE_CONGREGACION,
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },
  {
    path: RUTAS.MINISTERIOS,
    component: MinisteriosComponent,
  },
  {
    path: `${RUTAS.MINISTERIOS}/:id`,
    component: CrearMinisterioComponent,
    resolve: { ministerio: MinisterioResolver },
    data: { titulo: 'Crear Ministerio' },
  },

  {
    path: RUTAS.PAISES,
    component: PaisesComponent,
    data: { titulo: 'Paises' },
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver },
  },
  {
    path: `${RUTAS.PAISES}/:id`,
    component: CrearPaisComponent,
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver },
    data: { titulo: 'Crear Pais' },
  },
  {
    path: RUTAS.CONGREGACIONES,
    component: CongregacionesComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Congregaciones',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
        ROLES.ASISTENTE_OOTS,
      ],
    },
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver, pais: PaisResolver },
  },
  {
    path: `${RUTAS.CONGREGACIONES}/:id`,
    component: CrearCongregacionComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Congregaciones',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
        ROLES.ASISTENTE_OOTS,
      ],
    },
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver, pais: PaisResolver },
  },
  {
    path: RUTAS.CAMPOS,
    component: CamposComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Campos',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
        ROLES.ASISTENTE_OOTS,
      ],
    },
    resolve: { obrero: ObreroResolver, congregacion: CongregacionResolver, pais: PaisResolver },
  },
  {
    path: `${RUTAS.CAMPOS}/:id`,
    component: CrearCampoComponent,
    data: {
      titulo: 'Campos',
      role: [
        ROLES.ADMINISTRADOR,
        ROLES.SUPERVISOR,
        ROLES.SUPERVISOR_LOCAL,
        ROLES.OBRERO_CIUDAD,
        ROLES.OBRERO_CAMPO,
        ROLES.ASISTENTE_OOTS,
      ],
    },
    resolve: { obrero: ObreroResolver, congregacion: CongregacionResolver, pais: PaisResolver },
  },
  {
    path: RUTAS.TIPO_DE_DOCUMENTO,
    component: TiposDeDocumentosComponent,
    resolve: { pais: PaisResolver },
  },
  {
    path: `${RUTAS.TIPO_DE_DOCUMENTO}/:id`,
    component: CrearTipoDocumentoComponent,
    resolve: { pais: PaisResolver },
  },
  {
    path: RUTAS.CREAR_TIPO_ACTIVIDAD_ECONOMICA,
    component: TipoActividadEconomicaComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Tipos de Actividad Económica',
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
    },
  },
  {
    path: RUTAS.INFORME_ACTIVIDAD_ECONOMICA,
    component: ActividadEconomicaComponent,
    canActivate: [RolesGuard],
    data: {
      titulo: 'Actividades Económicas',
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.ASISTENTE_OOTS],
    },
  },

  // Configuracion
  {
    path: RUTAS.OPCION_DE_TRANSPORTE,
    component: OpcionDeTransporteComponent,
  },
  {
    path: RUTAS.GENERO,
    component: GeneroComponent,
  },
  {
    path: RUTAS.ESTADO_CIVIL,
    component: EstadoCivilComponent,
  },
  {
    path: RUTAS.GRADO_ALCANZADO,
    component: GradoAlcanzadoComponent,
  },
  {
    path: RUTAS.ROL_EN_CASA,
    component: RolEnCasaComponent,
  },
  {
    path: RUTAS.VOLUNTARIO,
    component: VoluntarioComponent,
  },
  {
    path: RUTAS.TIPO_DE_ESTUDIO,
    component: TipoDeEstudioComponent,
  },
  {
    path: RUTAS.RAZON_DE_SOLICITUD,
    component: RazonDeSolicitudComponent,
  },
  {
    path: RUTAS.PARENTESCO,
    component: ParentescoComponent,
  },

  {
    path: RUTAS.GENERAR_QR,
    loadComponent: () => import('src/app/pages/accesosQr/qr-code-generator/qr-code-generator.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS, ROLES.COMITE_RECTOR],
    },
  },

  {
    path: RUTAS.LISTAR_ACCESOS_QR,
    loadComponent: () => import('src/app/pages/accesosQr/listado-accesos-qr/listado-accesos-qr.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS, ROLES.COMITE_RECTOR],
    },
  },

  {
    path: RUTAS.GRUPO_GEMELOS,
    loadComponent: () => import('src/app/pages/administracion/grupoDeGemelos/grupo-gemelos/grupo-gemelos.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },

  {
    path: RUTAS.VER_GRUPO_DE_GEMELOS,
    loadComponent: () =>
      import('src/app/pages/administracion/grupoDeGemelos/ver-grupo-de-gemelos/ver-grupo-de-gemelos.component'),
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.ASISTENTE_OOTS],
    },
  },

  // Perfil
  {
    path: `${RUTAS.PERFIL}/:id`,
    component: PerfilComponent,
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
  // Informes
  {
    path: RUTAS.CREAR_TIPO_ACTIVIDAD,
    component: CrearActividadComponent,
    resolve: { seccionInforme: SeccionInformeResolver },
  },
  {
    path: RUTAS.CREAR_CAMPO,
    component: CrearCampoComponent,
  },

  {
    path: RUTAS.CREAR_PAIS,
    component: CrearPaisComponent,
  },
  {
    path: RUTAS.CREAR_ESTATUS,
    component: CrearStatusComponent,
  },
  {
    path: RUTAS.INFORME_ACTIVIDADES_ECLESIASTICAS,
    component: InformeActividadesComponent,
  },
  {
    path: RUTAS.INFORME_DIEZMOS,
    component: InformeDiezmosComponent,
  },
  {
    path: RUTAS.INFORME_LOGROS,
    component: InformeLogrosComponent,
  },
  {
    path: RUTAS.METAS,
    component: InformeMetasComponent,
  },
  {
    path: RUTAS.INFORME_VISITAS,
    component: InformeVisitasComponent,
  },
  {
    path: RUTAS.SITUACION_VISITA,
    component: InformeSituacionVisitaComponent,
  },
  // informes pagina principal
  {
    path: RUTAS.INFORME,
    component: InformeComponent,
  },
  {
    path: RUTAS.VER_INFORME,
    component: VerInformeComponent,
  },
  {
    path: `${RUTAS.SOLICITUD_MULTIMEDIA}/:id`,
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
    component: SolicitudMultimediaComponent,
    resolve: {
      tipoMiembro: TipoMiembroResolver,
      nacionalidad: NacionalidadResolver,
    },
  },
  {
    path: RUTAS.SOLICITUDES_MULTIMEDIA_PENDIENTES,
    component: SolicitudesPendienteComponent,
    resolve: {
      tipoMiembro: TipoMiembroResolver,
      nacionalidad: NacionalidadResolver,
    },
  },
  {
    path: `${RUTAS.EVENTOS}/:id`,
    component: ConfigurarEventosComponent,
  },
  {
    path: RUTAS.EVENTOS,
    component: EventosComponent,
  },
  {
    path: RUTAS.BIBLIOTECA_SERVICIOS,
    component: ServiciosComponent,
  },

  {
    path: RUTAS.EVENTOS_EN_VIVO,
    component: EventosEnVivoComponent,
    canActivate: [RolesGuard],
    data: {
      role: [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.SUPERVISOR_LOCAL, ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO],
    },
  },
];

export default childRoutes;
