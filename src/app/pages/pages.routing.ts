import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { TipoDocumentoResolver } from '../resolvers/tipo-documento/tipo-documento.resolver';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: 'sistema',
    component: PagesComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    // resolve: { tipoDocumentos: TipoDocumentoResolver },
    resolve: { tipoDocumentos: TipoDocumentoResolver },
    loadChildren: () => import('../routes/child-routes/child-routes.module').then((m) => m.ChildRoutesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
