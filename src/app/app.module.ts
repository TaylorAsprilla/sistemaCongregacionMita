import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ToastrModule } from 'ngx-toastr';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    PagesModule,
    AuthModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
