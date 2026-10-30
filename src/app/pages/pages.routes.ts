import { AuthGuard } from '../core/guards/auth.guard';
import { PermisosResolver } from '../resolvers/permisos/permisos.resolver';
import { PagesComponent } from './pages.component';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sistema',
    component: PagesComponent,
    title: 'Inicio',
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    resolve: { permisos: PermisosResolver },
    loadChildren: () => import('../routes/child-routes/child.routes'),
  },
];

export default routes;
