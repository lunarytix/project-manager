import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppearanceContainerComponent } from './pages/appearance-container/appearance-container.component';
import { AppearanceListComponent } from './components/appearance-list/appearance-list.component';
import { AppearanceFormComponent } from './components/appearance-form/appearance-form.component';

const routes: Routes = [
  {
    path: '',
    component: AppearanceContainerComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: AppearanceListComponent },
      { path: 'create', component: AppearanceFormComponent },
      { path: 'edit/:id', component: AppearanceFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppearanceRoutingModule { }