import { Routes } from '@angular/router';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { CONFIGURACION } from './core/enums/config.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/sistema/inicio',
    pathMatch: 'full',
    title: CONFIGURACION.TITLE,
  },
  {
    path: '',
    loadChildren: () => import('./pages/pages.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./pages/multimedia/multimedia.routes'),
  },
  {
    path: '**',
    component: NopagefoundComponent,
  },
];
