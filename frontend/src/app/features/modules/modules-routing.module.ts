import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuloContainerComponent } from './pages/modulo-container/modulo-container.component';
import { ListarModuloComponent } from './components/listar-modulo/listar-modulo.component';
import { CrearModuloComponent } from './components/crear-modulo/crear-modulo.component';
import { EditarModuloComponent } from './components/editar-modulo/editar-modulo.component';
import { EliminarModuloComponent } from './components/eliminar-modulo/eliminar-modulo.component';
import { ManagePermissionsComponent } from './pages/manage-permissions/manage-permissions.component';
import { PermissionCrudComponent } from './pages/permission-crud/permission-crud.component';

const routes: Routes = [
  {
    path: '',
    component: ModuloContainerComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ListarModuloComponent },
      { path: 'permissions/:id', component: ManagePermissionsComponent },
      { path: 'permissions-crud/:id', component: PermissionCrudComponent },
      { path: 'create', component: CrearModuloComponent },
      { path: 'edit/:id', component: EditarModuloComponent },
      { path: 'delete/:id', component: EliminarModuloComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
