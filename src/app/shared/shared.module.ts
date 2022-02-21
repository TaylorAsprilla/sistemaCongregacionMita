import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BredcrumbsComponent } from './bredcrumbs/bredcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [BredcrumbsComponent, FooterComponent, HeaderComponent, SidebarComponent, SpinnerComponent],
  exports: [BredcrumbsComponent, FooterComponent, HeaderComponent, SidebarComponent, SpinnerComponent],
  imports: [CommonModule, RouterModule, FormsModule, NgbModule, PerfectScrollbarModule],
})
export class SharedModule {}
