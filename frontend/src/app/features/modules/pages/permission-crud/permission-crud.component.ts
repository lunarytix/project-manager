import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../../../core/services/permission.service';
import { RoleService } from '../../../../core/services/role.service';
import { ModuleService } from '../../../../core/services/module.service';

@Component({
  selector: 'app-permission-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './permission-crud.component.html',
  styleUrls: ['./permission-crud.component.scss']
})
export class PermissionCrudComponent implements OnInit {
  moduleId: string | null = null;
  moduleName = '';
  roles: any[] = [];
  permissions: any[] = [];
  loading = false;

  // new permission form
  newRoleId: string | null = null;
  newCanRead = false;
  newCanCreate = false;
  newCanUpdate = false;
  newCanDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private permService: PermissionService,
    private roleService: RoleService,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get('id');
    if (!this.moduleId) { this.router.navigate(['/modules']); return; }
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.roleService.getAll().subscribe({ next: (r: any[]) => this.roles = r, error: () => this.roles = [] });
    this.moduleService.getById(this.moduleId!).subscribe({ next: (m: any) => this.moduleName = m?.nombre || '' , error: () => {} });
    this.permService.getByModule(this.moduleId!).subscribe({ next: (p: any[]) => { this.permissions = p; this.loading = false; }, error: () => { this.permissions = []; this.loading = false; } });
  }

  createPermission() {
    if (!this.moduleId || !this.newRoleId) { alert('Selecciona un rol'); return; }
    const body: any = { roleId: this.newRoleId, moduleId: this.moduleId, canRead: this.newCanRead, canCreate: this.newCanCreate, canUpdate: this.newCanUpdate, canDelete: this.newCanDelete };
    this.permService.create(body).subscribe({ next: p => { this.permissions.push(p); this.resetNew(); }, error: () => alert('Error creando permiso') });
  }

  resetNew() {
    this.newRoleId = null; this.newCanRead = this.newCanCreate = this.newCanUpdate = this.newCanDelete = false;
  }

  savePermission(p: any) {
    const body = { ...p };
    this.permService.update(p.id, body).subscribe({ next: updated => { const idx = this.permissions.findIndex(x => x.id === updated.id); if (idx >= 0) this.permissions[idx] = updated; }, error: () => alert('Error actualizando permiso') });
  }

  deletePermission(p: any) {
    if (!confirm('Eliminar permiso?')) return;
    this.permService.remove(p.id).subscribe({ next: () => { this.permissions = this.permissions.filter(x => x.id !== p.id); }, error: () => alert('Error eliminando permiso') });
  }

  back() { this.router.navigate(['/modules']); }
}
