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
import { InformeAsuntoPendienteComponent } from 'src/app/pages/informes/informe-asunto-pendiente/informe-asunto-pendiente.component';
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
import { TipoDocumentoResolver } from 'src/app/resolvers/tipo-documento/tipo-documento.resolver';
import { VacunaResolver } from 'src/app/resolvers/vacuna/vacuna.resolver';
import { DosisResolver } from 'src/app/resolvers/dosis/dosis.resolver';
import { RazonSolicitudResolver } from 'src/app/resolvers/razon-solicitud/razon-solicitud.resolver';
import { ParentescoResolver } from 'src/app/resolvers/parentesco/parentesco.resolver';

const childRoutes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    data: { titulo: 'Censo' },
  },

  // Administración
  {
    path: Rutas.USUARIOS,
    component: UsuariosComponent,
    data: { titulo: 'Usuarios Registrados' },
    resolve: { nacionalidad: NacionalidadResolver, pais: PaisResolver, campo: CampoResolver },
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
      tipoDocumento: TipoDocumentoResolver,
      vacuna: VacunaResolver,
      dosis: DosisResolver,
    },
  },

  {
    path: Rutas.REGISTRAR_USUARIO,
    component: RegistrarUsuarioComponent,
    resolve: { nacionalidad: NacionalidadResolver },
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
    resolve: { divisas: DivisasResolver },
  },
  {
    path: `${Rutas.PAISES}/:id`,
    component: CrearPaisComponent,
    data: { titulo: 'Crear Pais' },
  },
  {
    path: Rutas.CONGREGACIONES,
    component: CongregacionesComponent,
    data: { titulo: 'Congregaciones' },
  },
  {
    path: `${Rutas.CONGREGACIONES}/:id`,
    component: CrearCongregacionComponent,
  },
  {
    path: Rutas.CAMPOS,
    component: CamposComponent,
    data: { titulo: 'Campos' },
  },
  {
    path: `${Rutas.CAMPOS}/:id`,
    component: CrearCampoComponent,
  },

  // Perfil
  {
    path: Rutas.PERFIL,
    component: PerfilComponent,
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
    path: Rutas.ASUNTO_PENDIENTE,
    component: InformeAsuntoPendienteComponent,
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
    resolve: { informes: InformesResolver },
  },
  {
    path: Rutas.VER_INFORME,
    component: VerInformeComponent,
    resolve: { seccionInforme: SeccionInformeResolver },
  },
  {
    path: `${Rutas.SOLICITUD_MULTIMEDIA}/:id`,
    component: CrearSolicitudMultimediaComponent,
    resolve: {
      nacionalidad: NacionalidadResolver,
      congregacion: CongregacionResolver,
      pais: PaisResolver,
      razonSolicitud: RazonSolicitudResolver,
      parentesco: ParentescoResolver,
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
      parentesco: ParentescoResolver,
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
