import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
import { LoginComponent } from './login/login.component';
import { RecuperarCuentaComponent } from './recuperar-cuenta/recuperar-cuenta.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'recuperar-cuenta',
    component: RecuperarCuentaComponent,
  },
  {
    path: 'nueva-contrasena/:token',
    component: CambiarPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
