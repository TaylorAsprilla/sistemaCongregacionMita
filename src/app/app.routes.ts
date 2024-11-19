import { Routes } from '@angular/router';
import { CONFIGURACION } from './core/enums/config.enum';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PermisosResolver } from './resolvers/permisos/permisos.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sistema/inicio',
    pathMatch: 'full',
    title: CONFIGURACION.TITLE,
  },
  {
    path: '**',
    loadComponent: () => import('./pages/nopagefound/nopagefound.component').then((m) => m.NopagefoundComponent),
  },
  {
    path: 'sistema',
    component: PagesComponent,
    title: CONFIGURACION.TITLE,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    resolve: { permisos: PermisosResolver },
    loadChildren: () => import('./routes/child-routes/child-routes.module').then((m) => m.ChildRoutesModule),
  },
];
