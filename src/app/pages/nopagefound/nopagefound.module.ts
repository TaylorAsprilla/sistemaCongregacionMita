import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NopagefoundComponent } from './nopagefound.component';

@NgModule({
  declarations: [NopagefoundComponent],
  imports: [CommonModule, AppRoutingModule, FormsModule, ReactiveFormsModule, RouterModule, PipesModule],
  exports: [NopagefoundComponent],
})
export class NopagefoundModule {}
