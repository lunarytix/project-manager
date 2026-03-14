import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ModulesRoutingModule } from './modules-routing.module';
import { ModuloContainerComponent } from './pages/modulo-container/modulo-container.component';
import { ListarModuloComponent } from './components/listar-modulo/listar-modulo.component';
import { CrearModuloComponent } from './components/crear-modulo/crear-modulo.component';
import { EditarModuloComponent } from './components/editar-modulo/editar-modulo.component';
import { EliminarModuloComponent } from './components/eliminar-modulo/eliminar-modulo.component';
import { ManagePermissionsComponent } from './pages/manage-permissions/manage-permissions.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModuloContainerComponent,
    ListarModuloComponent,
    CrearModuloComponent,
    EditarModuloComponent,
    EliminarModuloComponent,
    ManagePermissionsComponent,
    ModulesRoutingModule
  ]
})
export class ModulesModule { }
