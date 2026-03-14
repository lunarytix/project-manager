import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RolesDialogComponent } from '../roles-dialog/roles-dialog.component';
import { Module as AppModule } from '../../../../core/models/module.model';
import { ModuleService } from '../../../../core/services/module.service';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';
import { RoleService } from '../../../../core/services/role.service';
import { PermissionService } from '../../../../core/services/permission.service';

@Component({
  selector: 'app-listar-modulo',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, GenericTableComponent],
  templateUrl: './listar-modulo.component.html',
  styleUrls: ['./listar-modulo.component.scss']
})
export class ListarModuloComponent implements OnInit {
  modules: AppModule[] = [];
  loading = false;
  error: string | null = null;
  roles: any[] = [];
  expandedModuleId: string | null = null;
  permissionsMap: Record<string, Record<string, any>> = {};
  modalOpen = false;
  modalModuleId: string | null = null;

  constructor(
    private moduleService: ModuleService,
    private router: Router,
    private roleService: RoleService,
    private permService: PermissionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadModules();
  }

  loadModules(): void {
    this.loading = true;
    this.moduleService.getAll().subscribe({
      next: data => { this.modules = (data || []).map((m: any) => ({ ...m, rolesPermitidosString: (m.rolesPermitidos || []).join(', ') })); this.loading = false; },
      error: err => { this.error = err?.message || 'Error al cargar módulos'; this.loading = false; }
    });
  }

  private loadRoles() {
    // load roles once
    if (this.roles.length) return;
    this.roleService.getAll().subscribe({ next: r => this.roles = r, error: () => this.roles = [] });
  }

  onCreate(): void { this.router.navigate(['/modules/create']); }
  onEdit(id?: string): void { if (id) this.router.navigate(['/modules/edit', id]); }
  onDelete(id?: string): void { if (!id) return; if (!confirm('Eliminar módulo?')) return; this.moduleService.delete(id).subscribe({ next: () => this.loadModules(), error: () => alert('Error al eliminar') }); }
  onPermissions(id?: string): void { if (!id) return; this.router.navigate(['/modules/permissions', id]); }

  cols: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'ruta', label: 'Ruta' },
    { key: 'rolesPermitidosString', label: 'Roles Permitidos' },
    { key: 'activo', label: 'Activo', format: 'bool' }
  ];

  extraActions = [
    { key: 'permissions', label: 'Permisos' },
    { key: 'assign', label: 'Asignar roles' }
  ];

  handleAction(evt: { key: string; row: any }) {
    if (!evt || !evt.row) return;
    const key = evt.key;
    const id = evt.row.id;
    if (key === 'permissions') this.onPermissions(id);
    if (key === 'assign') this.toggleRolesView(id);
  }

  toggleRolesView(moduleId?: string) {
    if (!moduleId) return;
    this.expandedModuleId = this.expandedModuleId === moduleId ? null : moduleId;
    if (this.expandedModuleId) {
      this.loadRoles();
      // load existing permissions for this module
      this.permService.getByModule(moduleId).subscribe({ next: perms => {
        this.permissionsMap[moduleId] = {};
        perms.forEach((p: any) => { if (p.role && p.role.id) this.permissionsMap[moduleId][p.role.id] = p; });
      }, error: () => { this.permissionsMap[moduleId] = {}; } });
    }
  }

  toggleRolePermission(moduleId?: string, roleId?: string, checked?: boolean) {
    if (!moduleId || !roleId) return;
    const existing = (this.permissionsMap[moduleId] || {})[roleId];
    if (existing) {
      const body = { ...existing, canRead: checked };
      this.permService.update(existing.id, body).subscribe({ next: p => { this.permissionsMap[moduleId][roleId] = p; }, error: () => alert('Error actualizando permiso') });
    } else {
      const body: any = { roleId, moduleId, canRead: checked, canCreate: false, canUpdate: false, canDelete: false };
      this.permService.create(body).subscribe({ next: p => { if (!this.permissionsMap[moduleId]) this.permissionsMap[moduleId] = {}; this.permissionsMap[moduleId][roleId] = p; }, error: () => alert('Error creando permiso') });
    }
  }

  onRoleCheckboxChange(event: Event, moduleId?: string, roleId?: string) {
    const target = event.target as HTMLInputElement | null;
    const checked = !!(target && target.checked);
    this.toggleRolePermission(moduleId, roleId, checked);
  }

  openModal(moduleId?: string) {
    if (!moduleId) return;
    this.dialog.open(RolesDialogComponent, { width: '720px', data: { moduleId, moduleName: this.modules.find(m=>m.id===moduleId)?.nombre } })
      .afterClosed().subscribe((saved: boolean) => {
        if (saved) {
          this.permService.getByModule(moduleId).subscribe({ next: perms => {
            this.permissionsMap[moduleId] = {};
            perms.forEach((p:any) => { if (p.role && p.role.id) this.permissionsMap[moduleId][p.role.id] = p; });
          }, error: () => { this.permissionsMap[moduleId] = {}; } });
        }
      });
  }

  onModalClose(saved: boolean) {
    this.modalOpen = false;
    const mid = this.modalModuleId;
    this.modalModuleId = null;
    if (saved && mid) {
      // refresh permissions map for this module
      this.permService.getByModule(mid).subscribe({ next: perms => {
        this.permissionsMap[mid] = {};
        perms.forEach((p:any) => { if (p.role && p.role.id) this.permissionsMap[mid][p.role.id] = p; });
      }, error: () => { this.permissionsMap[mid] = {}; } });
    }
  }
}
