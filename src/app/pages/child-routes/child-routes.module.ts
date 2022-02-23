import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamposComponent } from '../administracion/campos/campos.component';
import { CongregacionesComponent } from '../administracion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from '../administracion/ministerios/ministerios.component';
import { UsuariosComponent } from '../administracion/usuarios/usuarios.component';
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
  {
    path: 'perfil',
    component: PerfilComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
