import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: 'sistema',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    component: PagesComponent,
    loadChildren: () => import('./child-routes/child-routes.module').then((m) => m.ChildRoutesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
