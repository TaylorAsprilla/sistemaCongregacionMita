import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamposComponent } from 'src/app/pages/administracion/campo/campos/campos.component';
import { CongregacionesComponent } from 'src/app/pages/administracion/congregacion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from 'src/app/pages/administracion/ministerios/ministerios/ministerios.component';
import { UsuariosComponent } from 'src/app/pages/administracion/usuario/usuarios/usuarios.component';
import { CrearActividadComponent } from 'src/app/pages/informes/crear-actividad/crear-actividad.component';

import { CrearCampoComponent } from 'src/app/pages/administracion/campo/crear-campo/crear-campo.component';

import { CrearStatusComponent } from 'src/app/pages/informes/crear-status/crear-status.component';
import { InformeActividadesComponent } from 'src/app/pages/informes/informe-actividades/informe-actividades.component';
import { InformeContablesComponent } from 'src/app/pages/informes/informe-contables/informe-contables.component';
import { InformeLogrosComponent } from 'src/app/pages/informes/informe-logros/informe-logros.component';
import { InformeMetasComponent } from 'src/app/pages/informes/informe-metas/informe-metas.component';
import { InformeVisitasComponent } from 'src/app/pages/informes/informe-visitas/informe-visitas.component';
import { InformeComponent } from 'src/app/pages/informes/informe/informe.component';
import { VerInformeComponent } from 'src/app/pages/informes/ver-informe/ver-informe.component';
import { InicioComponent } from 'src/app/pages/inicio/inicio.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';

import { RegistrarUsuarioComponent } from 'src/app/pages/administracion/usuario/registrar-usuario/registrar-usuario.component';
import { Rutas } from '../menu-items';
import { InformeSituacionVisitaComponent } from 'src/app/pages/informes/informe-situacion-visita/informe-situacion-visita.component';
import { InformesResolver } from 'src/app/resolvers/informes/informes.resolver';
import { CrearCongregacionComponent } from 'src/app/pages/administracion/congregacion/crear-congregacion/crear-congregacion.component';
import { PaisesComponent } from 'src/app/pages/administracion/pais/paises/paises.component';
import { CrearPaisComponent } from 'src/app/pages/administracion/pais/crear-pais/crear-pais.component';
import { DivisasResolver } from 'src/app/resolvers/divisas/divisas.resolver';
import { SeccionInformeResolver } from 'src/app/resolvers/seccion-informe/seccion-informe.resolver';
import { NacionalidadResolver } from 'src/app/resolvers/nacionalidad/nacionalidad.resolver';
import { CrearSolicitudMultimediaComponent } from 'src/app/pages/multimedia/crear-solicitud-multimedia/crear-solicitud-multimedia.component';
import { SolicitudMultimediaComponent } from 'src/app/pages/multimedia/solicitud-multimedia/solicitud-multimedia.component';
import { EstadoCivilResolver } from 'src/app/resolvers/estado-civil/estado-civil.resolver';
import { GeneroResolver } from 'src/app/resolvers/genero/genero.resolver';
import { RolCasaResolver } from 'src/app/resolvers/rol-casa/rol-casa.resolver';
import { FuenteIngresoResolver } from 'src/app/resolvers/fuente-ingreso/fuente-ingreso.resolver';
import { GradoAcademicoResolver } from 'src/app/resolvers/grado-academico/grado-academico.resolver';
import { TipoEmpleoResolver } from 'src/app/resolvers/tipo-empleo/tipo-empleo.resolver';
import { CongregacionResolver } from 'src/app/resolvers/congregacion/congregacion.resolver';
import { TipoMiembroResolver } from 'src/app/resolvers/tipo-miembro/tipo-miembro.resolver';
import { MinisterioResolver } from 'src/app/resolvers/ministerio/ministerio.resolver';
import { VoluntariadoResolver } from 'src/app/resolvers/voluntariado/voluntariado.resolver';
import { PaisResolver } from 'src/app/resolvers/pais/pais.resolver';
import { CampoResolver } from 'src/app/resolvers/campo/campo.resolver';
import { VacunaResolver } from 'src/app/resolvers/vacuna/vacuna.resolver';
import { DosisResolver } from 'src/app/resolvers/dosis/dosis.resolver';
import { RazonSolicitudResolver } from 'src/app/resolvers/razon-solicitud/razon-solicitud.resolver';
import { ServiciosYVigiliasComponent } from 'src/app/pages/multimedia/servicios-y-vigilias/servicios-y-vigilias.component';
import { ConfigurarServiciosYVigiliasComponent } from 'src/app/pages/multimedia/configurar-servicios-y-vigilias/configurar-servicios-y-vigilias.component';
import { LinkEventosResolver } from 'src/app/resolvers/link-eventos/link-eventos.resolver';
import { ServiciosComponent } from 'src/app/pages/multimedia/biblioteca-multimedia/servicios/servicios.component';
import { VigiliasComponent } from 'src/app/pages/multimedia/biblioteca-multimedia/vigilias/vigilias.component';
import { ConfirmacionDeRegistroComponent } from 'src/app/pages/administracion/usuario/confirmacion-de-registro/confirmacion-de-registro.component';
import { ObreroResolver } from 'src/app/resolvers/obrero/obrero.resolver';
import { TiposDeDocumentosComponent } from 'src/app/pages/administracion/tipo-de-documento/tipos-de-documentos/tipos-de-documentos.component';
import { CrearTipoDocumentoComponent } from 'src/app/pages/administracion/tipo-de-documento/crear-tipo-documento/crear-tipo-documento.component';
import { DocumentoResolver } from 'src/app/resolvers/tipo-documento/documento.resolver';
import { PermisosResolver } from 'src/app/resolvers/permisos/permisos.resolver';
import { UsuariosSupervisorComponent } from 'src/app/pages/supervisor/usuarios-supervisor/usuarios-supervisor.component';

const childRoutes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    data: { titulo: 'Censo' },
    resolve: {
      congregacion: CongregacionResolver,
      ministerio: MinisterioResolver,
      pais: PaisResolver,
      campo: CampoResolver,
      permiso: PermisosResolver,
    },
  },

  // Administración
  {
    path: Rutas.USUARIOS,
    component: UsuariosComponent,
    data: { titulo: 'Usuarios Registrados' },
    resolve: {
      congregacion: CongregacionResolver,
      ministerio: MinisterioResolver,
      pais: PaisResolver,
      campo: CampoResolver,
    },
  },
  {
    path: `${Rutas.USUARIOS}/:id`,
    component: RegistrarUsuarioComponent,
    resolve: {
      nacionalidad: NacionalidadResolver,
      estadoCivil: EstadoCivilResolver,
      genero: GeneroResolver,
      rolCasa: RolCasaResolver,
      fuenteDeIngreso: FuenteIngresoResolver,
      gradoAcademico: GradoAcademicoResolver,
      tipoEmpleo: TipoEmpleoResolver,
      congregacion: CongregacionResolver,
      tipoMiembro: TipoMiembroResolver,
      ministerio: MinisterioResolver,
      voluntariado: VoluntariadoResolver,
      pais: PaisResolver,
      campo: CampoResolver,
      vacuna: VacunaResolver,
      dosis: DosisResolver,
      tipoDocumento: DocumentoResolver,
    },
  },

  {
    path: Rutas.USUARIOS_SUPERVISOR,
    component: UsuariosSupervisorComponent,
  },

  {
    path: Rutas.REGISTRAR_USUARIO,
    component: RegistrarUsuarioComponent,
    resolve: { nacionalidad: NacionalidadResolver },
  },

  {
    path: `${Rutas.CONFIRMAR_REGISTRO}/:id`,
    component: ConfirmacionDeRegistroComponent,
  },
  {
    path: Rutas.MINISTERIOS,
    component: MinisteriosComponent,
    // resolve: { nacionalidad: NacionalidadResolver },
  },

  {
    path: Rutas.PAISES,
    component: PaisesComponent,
    data: { titulo: 'Paises' },
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver },
  },
  {
    path: `${Rutas.PAISES}/:id`,
    component: CrearPaisComponent,
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver },
    data: { titulo: 'Crear Pais' },
  },
  {
    path: Rutas.CONGREGACIONES,
    component: CongregacionesComponent,
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver, pais: PaisResolver },
    data: { titulo: 'Congregaciones' },
  },
  {
    path: `${Rutas.CONGREGACIONES}/:id`,
    component: CrearCongregacionComponent,
    resolve: { divisas: DivisasResolver, obrero: ObreroResolver, pais: PaisResolver },
  },
  {
    path: Rutas.CAMPOS,
    component: CamposComponent,
    resolve: { obrero: ObreroResolver, congregacion: CongregacionResolver, pais: PaisResolver },
    data: { titulo: 'Campos' },
  },
  {
    path: `${Rutas.CAMPOS}/:id`,
    component: CrearCampoComponent,
    resolve: { obrero: ObreroResolver, congregacion: CongregacionResolver, pais: PaisResolver },
  },
  {
    path: Rutas.TIPO_DE_DOCUMENTO,
    component: TiposDeDocumentosComponent,
    resolve: { pais: PaisResolver },
  },
  {
    path: `${Rutas.TIPO_DE_DOCUMENTO}/:id`,
    component: CrearTipoDocumentoComponent,
    resolve: { pais: PaisResolver },
  },

  // Perfil
  {
    path: Rutas.PERFIL,
    component: PerfilComponent,
    resolve: {
      nacionalidad: NacionalidadResolver,
      estadoCivil: EstadoCivilResolver,
      genero: GeneroResolver,
      rolCasa: RolCasaResolver,
      fuenteDeIngreso: FuenteIngresoResolver,
      gradoAcademico: GradoAcademicoResolver,
      tipoEmpleo: TipoEmpleoResolver,
      congregacion: CongregacionResolver,
      tipoMiembro: TipoMiembroResolver,
      ministerio: MinisterioResolver,
      voluntariado: VoluntariadoResolver,
      pais: PaisResolver,
      campo: CampoResolver,
      vacuna: VacunaResolver,
      dosis: DosisResolver,
      tipoDocumento: DocumentoResolver,
    },
  },
  // Informes
  {
    path: Rutas.CREAR_TIPO_ACTIVIDAD,
    component: CrearActividadComponent,
    resolve: { seccionInforme: SeccionInformeResolver },
  },
  {
    path: Rutas.CREAR_CAMPO,
    component: CrearCampoComponent,
  },

  {
    path: Rutas.CREAR_PAIS,
    component: CrearPaisComponent,
  },
  {
    path: Rutas.CREAR_ESTATUS,
    component: CrearStatusComponent,
  },
  {
    path: Rutas.INFORME_ACTIVIDADES,
    component: InformeActividadesComponent,
  },
  {
    path: Rutas.INFORME_CONTABLE,
    component: InformeContablesComponent,
  },
  {
    path: Rutas.INFORME_LOGROS,
    component: InformeLogrosComponent,
  },
  {
    path: Rutas.METAS,
    component: InformeMetasComponent,
  },
  {
    path: Rutas.INFORME_VISITAS,
    component: InformeVisitasComponent,
  },
  {
    path: Rutas.SITUACION_VISITA,
    component: InformeSituacionVisitaComponent,
  },
  // informes pagina principal
  {
    path: Rutas.INFORME,
    component: InformeComponent,
    resolve: {
      informes: InformesResolver,
    },
  },
  {
    path: Rutas.VER_INFORME,
    component: VerInformeComponent,
    resolve: {
      seccionInforme: SeccionInformeResolver,
      congregacion: CongregacionResolver,
      obrero: ObreroResolver,
    },
  },
  {
    path: `${Rutas.SOLICITUD_MULTIMEDIA}/:id`,
    component: CrearSolicitudMultimediaComponent,
    resolve: {
      nacionalidad: NacionalidadResolver,
      congregacion: CongregacionResolver,
      pais: PaisResolver,
      razonSolicitud: RazonSolicitudResolver,
    },
  },
  {
    path: Rutas.SOLICITUDES_MULTIMEDIA,
    component: SolicitudMultimediaComponent,
    resolve: {
      nacionalidad: NacionalidadResolver,
      congregacion: CongregacionResolver,
      pais: PaisResolver,
      razonSolicitud: RazonSolicitudResolver,
    },
  },
  {
    path: Rutas.SERVICIOS_Y_VIGILIAS,
    component: ServiciosYVigiliasComponent,
    resolve: {
      linkEventos: LinkEventosResolver,
    },
  },
  {
    path: Rutas.CONFIGURAR_SERVICIOS_Y_VIGILIAS,
    component: ConfigurarServiciosYVigiliasComponent,
  },
  {
    path: Rutas.BIBLIOTECA_SERVICIOS,
    component: ServiciosComponent,
    resolve: {
      linkEventos: LinkEventosResolver,
    },
  },
  {
    path: Rutas.BIBLIOTECA_VIGILIAS,
    component: VigiliasComponent,
    resolve: {
      linkEventos: LinkEventosResolver,
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
