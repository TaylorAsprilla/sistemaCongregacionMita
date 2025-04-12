import { Routes } from '@angular/router';

import { CONFIGURACION } from '../core/enums/config.enum';
import LoginComponent from './login/login.component';
import RecuperarCuentaComponent from './recuperar-cuenta/recuperar-cuenta.component';
import CambiarPasswordComponent from './cambiar-password/cambiar-password.component';

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

export default routes;
