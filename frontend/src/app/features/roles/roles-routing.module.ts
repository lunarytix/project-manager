import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesContainerComponent } from './pages/roles-container/roles-container.component';

const routes: Routes = [
  { path: '', component: RolesContainerComponent },
  { path: ':id/permissions', loadComponent: () => import('./pages/role-permissions/role-permissions.component').then(m => m.RolePermissionsComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
