import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CamposComponent } from './pages/administracion/campos/campos.component';
import { CongregacionesComponent } from './pages/administracion/congregaciones/congregaciones.component';
import { MinisterioComponent } from './pages/administracion/ministerio/ministerio.component';
import { UsuariosComponent } from './pages/administracion/usuarios/usuarios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterUserComponent } from './pages/registro/register-user/register-user.component';
import { RegisterCongComponent } from './pages/registro/register-cong/register-cong.component';
import { RegisterCampoComponent } from './pages/registro/register-campo/register-campo.component';
import { RegisterComponent } from './pages/registro/register/register.component';
import { RegisterMinisterioComponent } from './pages/registro/register-ministerio/register-ministerio.component';

const routes: Routes = [
  {
path:'',
component: HomeComponent,
children:[ 
  {
    path: 'register',
    component: RegisterComponent,
    children: [
      { 
      path: '', 
      redirectTo: '/register/user', 
      pathMatch: 'full' },
      {
        path: 'user',
        component: RegisterUserComponent
      },
      {
        path: 'congregacion',
        component: RegisterCongComponent
      },
      {
        path: 'campo',
        component: RegisterCampoComponent
      },
      {
        path: 'ministerio',
        component: RegisterMinisterioComponent
      }
    ]
  },
  {
  path: 'dashboard',
  component: DashboardComponent,
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
]
  },
  {
    path: 'login',
    component: LoginComponent,
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
