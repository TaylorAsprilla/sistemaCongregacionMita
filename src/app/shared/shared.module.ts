import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BredcrumbsComponent } from './bredcrumbs/bredcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectiveModule } from '../directive/directive.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    exports: [BredcrumbsComponent, FooterComponent, HeaderComponent, SidebarComponent],
    imports: [CommonModule, RouterModule, FormsModule, DirectiveModule, NgbModule, BredcrumbsComponent, FooterComponent, HeaderComponent, SidebarComponent],
})
export class SharedModule {}
