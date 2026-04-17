import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditRoutingModule } from './audit-routing.module';
import { AuditPanelComponent } from './pages/audit-panel/audit-panel.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuditPanelComponent,
    AuditRoutingModule,
  ],
})
export class AuditModule {}
