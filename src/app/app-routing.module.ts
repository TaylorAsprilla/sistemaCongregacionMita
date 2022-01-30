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
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
path:'',
component: HomeComponent,
children:[ 
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
    path: 'register',
    component: RegisterComponent,
  },
  
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full',
  // },
  // {
  //   path: '**',
  //   component: NopagefoundComponent,
  // },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
