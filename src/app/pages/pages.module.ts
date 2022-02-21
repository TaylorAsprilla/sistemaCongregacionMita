import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministracionModule } from './administracion/administracion.module';
import { RegisterModule } from './registro/register.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardComponentsModule } from '../components/dashboard-components/dashboard-components.module';
import { ProfileComponent } from '../components/dashboard-components/profile/profile.component';

@NgModule({
  declarations: [NopagefoundComponent, DashboardComponent, PagesComponent],
  exports: [NopagefoundComponent, DashboardComponent, PagesComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AdministracionModule,
    RegisterModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    DashboardComponentsModule,
  ],
})
export class PagesModule {}
