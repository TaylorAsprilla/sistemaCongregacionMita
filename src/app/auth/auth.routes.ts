import { Routes } from '@angular/router';

import LoginComponent from './login/login.component';
import RecuperarCuentaComponent from './recuperar-cuenta/recuperar-cuenta.component';
import CambiarPasswordComponent from './cambiar-password/cambiar-password.component';

const routes: Routes = [
  {
    path: 'login',
    title: (route) => route.queryParamMap.get('ticket') ? 'Acceso QR' : 'Iniciar sesión',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    component: LoginComponent,
  },
  {
    path: 'recuperar-cuenta',
    component: RecuperarCuentaComponent,
    title: 'Recuperar cuenta',
  },
  {
    path: 'nueva-contrasena/:token',
    component: CambiarPasswordComponent,
    title: 'Crear nueva contraseña',
  },
];

export default routes;
