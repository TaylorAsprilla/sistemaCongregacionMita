import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamposComponent } from '../administracion/campos/campos.component';
import { CongregacionesComponent } from '../administracion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from '../administracion/ministerios/ministerios.component';
import { UsuariosComponent } from '../administracion/usuarios/usuarios.component';
import { CrearActividadComponent } from '../informes/crear-actividad/crear-actividad.component';
import { CrearStatusComponent } from '../informes/crear-status/crear-status.component';
import { InformeActividadesComponent } from '../informes/informe-actividades/informe-actividades.component';
import { InformeContablesComponent } from '../informes/informe-contables/informe-contables.component';
import { InformeLogrosComponent } from '../informes/informe-logros/informe-logros.component';
import { InformeMetasComponent } from '../informes/informe-metas/informe-metas.component';
import { InformeVisitasComponent } from '../informes/informe-visitas/informe-visitas.component';
import { InformeComponent } from '../informes/informe/informe.component';
import { SituacionVisitaComponent } from '../informes/situacion-visita/situacion-visita.component';
import { InicioComponent } from '../inicio/inicio.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { RegisterCampoComponent } from '../registro/register-campo/register-campo.component';
import { RegisterCongregacionComponent } from '../registro/register-congregacion/register-congregacion.component';
import { RegisterMinisterioComponent } from '../registro/register-ministerio/register-ministerio.component';
import { RegisterUserComponent } from '../registro/register-user/register-user.component';

const childRoutes: Routes = [
  {
    path: '',
    component: InicioComponent,
    data: { titulo: 'Inicio' },
  },

  // Administración
  {
    path: 'usuarios',
    component: UsuariosComponent,
    data: { titulo: 'Usuarios Registrados' },
  },
  {
    path: 'ministerios',
    component: MinisteriosComponent,
    data: { titulo: 'Ministerios' },
  },
  {
    path: 'congregaciones',
    component: CongregacionesComponent,
    data: { titulo: 'Congregaciones' },
  },
  {
    path: 'campos',
    component: CamposComponent,
    data: { titulo: 'Campos' },
  },

  {
    path: 'register/user',
    redirectTo: '/register/user',
    pathMatch: 'full',
  },
  {
    path: 'registrarUsuario',
    component: RegisterUserComponent,
  },
  {
    path: 'congregacion',
    component: RegisterCongregacionComponent,
  },
  {
    path: 'campo',
    component: RegisterCampoComponent,
  },
  {
    path: 'ministerio',
    component: RegisterMinisterioComponent,
  },
  // Perfil
  {
    path: 'perfil',
    component: PerfilComponent,
  },
  // Informes
  {
    path: 'crearActividad',
    component: CrearActividadComponent,
  },
  {
    path: 'crearStatus',
    component: CrearStatusComponent,
  },
  {
    path: 'informeActividades',
    component: InformeActividadesComponent,
  },
  {
    path: 'informeContables',
    component: InformeContablesComponent,
  },
  {
    path: 'informeLogros',
    component: InformeLogrosComponent,
  },
  {
    path: 'informeMetas',
    component: InformeMetasComponent,
  },
  {
    path: 'informeVisitas',
    component: InformeVisitasComponent,
  },
  {
    path: 'situacionVisita',
    component: SituacionVisitaComponent,
  },
  // informes pagina principal
  {
    path: 'informe',
    component: InformeComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
