import { Routes } from '@angular/router';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/sistema/inicio',
    pathMatch: 'full',
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
    title: 'Página no encontrada',
    component: NopagefoundComponent,
  },
];
