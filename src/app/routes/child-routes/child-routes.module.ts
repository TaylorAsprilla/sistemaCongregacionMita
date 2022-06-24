import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamposComponent } from 'src/app/pages/administracion/campos/campos.component';
import { CongregacionesComponent } from 'src/app/pages/administracion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from 'src/app/pages/administracion/ministerios/ministerios.component';
import { UsuariosComponent } from 'src/app/pages/administracion/usuarios/usuarios.component';
import { CrearActividadComponent } from 'src/app/pages/informes/crear-actividad/crear-actividad.component';
import { CrearStatusComponent } from 'src/app/pages/informes/crear-status/crear-status.component';
import { InformeActividadesComponent } from 'src/app/pages/informes/informe-actividades/informe-actividades.component';
import { InformeContablesComponent } from 'src/app/pages/informes/informe-contables/informe-contables.component';
import { InformeLogrosComponent } from 'src/app/pages/informes/informe-logros/informe-logros.component';
import { InformeMetasComponent } from 'src/app/pages/informes/informe-metas/informe-metas.component';
import { InformeVisitasComponent } from 'src/app/pages/informes/informe-visitas/informe-visitas.component';
import { InformeComponent } from 'src/app/pages/informes/informe/informe.component';
import { SituacionVisitaComponent } from 'src/app/pages/informes/situacion-visita/situacion-visita.component';
import { InicioComponent } from 'src/app/pages/inicio/inicio.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { RegisterCampoComponent } from 'src/app/pages/registro/register-campo/register-campo.component';
import { RegisterCongregacionComponent } from 'src/app/pages/registro/register-congregacion/register-congregacion.component';
import { RegisterMinisterioComponent } from 'src/app/pages/registro/register-ministerio/register-ministerio.component';
import { RegistrarUsuarioComponent } from 'src/app/pages/registro/registrar-usuario/registrar-usuario.component';

const childRoutes: Routes = [
  {
    path: '',
    component: InicioComponent,
    data: { titulo: 'Inicio oooo' },
  },

  {
    path: '',
    component: InicioComponent,
    data: { titulo: 'Censo' },
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
    component: RegistrarUsuarioComponent,
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
