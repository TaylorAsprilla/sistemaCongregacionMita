import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
import { LoginComponent } from './login/login.component';
import { RecuperarCuentaComponent } from './recuperar-cuenta/recuperar-cuenta.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'CMAR LIVE',
  },

  {
    path: 'recuperar-cuenta',
    component: RecuperarCuentaComponent,
    title: 'CMAR LIVE',
  },
  {
    path: 'nueva-contrasena/:token',
    component: CambiarPasswordComponent,
    title: 'CMAR LIVE',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
