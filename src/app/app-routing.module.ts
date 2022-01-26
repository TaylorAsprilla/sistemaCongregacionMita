import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CamposComponent } from './pages/administracion/campos/campos.component';
import { CongregacionesComponent } from './pages/administracion/congregaciones/congregaciones.component';
import { MinisterioComponent } from './pages/administracion/ministerio/ministerio.component';
import { UsuariosComponent } from './pages/administracion/usuarios/usuarios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
  },
  {
    path: 'congregaciones',
    component: CongregacionesComponent,
  },
  {
    path: 'campos',
    component: CamposComponent,
  },
  {
    path: 'ministerios',
    component: MinisterioComponent,
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NopagefoundComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
