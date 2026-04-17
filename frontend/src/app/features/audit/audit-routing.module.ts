import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditPanelComponent } from './pages/audit-panel/audit-panel.component';

const routes: Routes = [
  {
    path: '',
    component: AuditPanelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {}
