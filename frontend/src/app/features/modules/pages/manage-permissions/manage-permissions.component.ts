import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PermissionService } from '../../../../core/services/permission.service';
import { RoleService } from '../../../../core/services/role.service';
import { ModuleService } from '../../../../core/services/module.service';

@Component({
  selector: 'app-manage-permissions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-permissions.component.html',
  styleUrls: ['./manage-permissions.component.scss']
})
export class ManagePermissionsComponent implements OnInit {
  moduleId: string | null = null;
  moduleName = '';
  roles: any[] = [];
  permissionsMap: Record<string, any> = {};
  loading = false;

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

    this.loadData();
  }

  private loadData() {
    this.loading = true;
    this.roleService.getAll().subscribe({
      next: roles => { this.roles = roles; this.loadPermissions(); },
      error: () => { this.roles = []; this.loading = false; }
    });

    this.moduleService.getById(this.moduleId!).subscribe({ next: m => this.moduleName = m?.nombre || '' , error: () => {} });
  }

  private loadPermissions() {
    if (!this.moduleId) return;
    this.permService.getByModule(this.moduleId).subscribe({
      next: perms => {
        this.permissionsMap = {};
        perms.forEach(p => { if (p.role && p.role.id) this.permissionsMap[p.role.id] = p; });
        this.loading = false;
      },
      error: () => { this.permissionsMap = {}; this.loading = false; }
    });
  }

  toggle(roleId: string, field: 'canRead'|'canCreate'|'canUpdate'|'canDelete', value: boolean) {
    const existing = this.permissionsMap[roleId];
    if (existing) {
      // update
      const body = { ...existing, [field]: value };
      this.permService.update(existing.id, body).subscribe({ next: p => { this.permissionsMap[roleId] = p; }, error: () => alert('Error actualizando permiso') });
    } else {
      // create
      const body = { roleId, moduleId: this.moduleId, canRead: false, canCreate: false, canUpdate: false, canDelete: false } as any;
      body[field] = value;
      this.permService.create(body).subscribe({ next: p => { this.permissionsMap[roleId] = p; }, error: () => alert('Error creando permiso') });
    }
  }

  back() { this.router.navigate(['/modules']); }

  onCheckboxChange(event: Event, roleId: string, field: 'canRead'|'canCreate'|'canUpdate'|'canDelete') {
    const target = event.target as HTMLInputElement | null;
    const checked = !!(target && target.checked);
    this.toggle(roleId, field, checked);
  }
}
