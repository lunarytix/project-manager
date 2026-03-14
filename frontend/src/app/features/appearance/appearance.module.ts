import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppearanceRoutingModule } from './appearance-routing.module';
import { AppearanceContainerComponent } from './pages/appearance-container/appearance-container.component';
import { AppearanceListComponent } from './components/appearance-list/appearance-list.component';
import { AppearanceFormComponent } from './components/appearance-form/appearance-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppearanceContainerComponent,
    AppearanceListComponent,
    AppearanceFormComponent,
    AppearanceRoutingModule
  ]
})
export class AppearanceModule { }