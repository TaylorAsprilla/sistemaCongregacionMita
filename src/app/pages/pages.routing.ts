import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { PermisosResolver } from '../resolvers/permisos/permisos.resolver';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: 'sistema',
    component: PagesComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    resolve: { permisos: PermisosResolver },
    title: 'CMAR LIVE',

    loadChildren: () => import('../routes/child-routes/child-routes.module').then((m) => m.ChildRoutesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
