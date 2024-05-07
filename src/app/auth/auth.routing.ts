import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
import { LoginComponent } from './login/login.component';
import { RecuperarCuentaComponent } from './recuperar-cuenta/recuperar-cuenta.component';
import { CONFIGURACION } from '../core/enums/config.enum';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'recuperar-cuenta',
    component: RecuperarCuentaComponent,
    title: CONFIGURACION.TITLE,
  },
  {
    path: 'nueva-contrasena/:token',
    component: CambiarPasswordComponent,
    title: CONFIGURACION.TITLE,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
