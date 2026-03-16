import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoleService } from '../../../../core/services/role.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { PermissionCatalogService } from '../../../../core/services/permission-catalog.service';
import { ModuleService } from '../../../../core/services/module.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCheckboxModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.scss']
})
export class RolePermissionsComponent implements OnInit, AfterViewChecked, OnDestroy {
  roleId: string = '';
  role: any = null;
  modules: any[] = [];
  permissionCatalogs: any[] = [];
  permissions: any[] = [];
  loading = true;
  saving = false;

  // Matrix to track permissions [moduleId][catalogId] = boolean
  permissionMatrix: { [moduleId: string]: { [catalogId: string]: boolean } } = {};
  // track last counts to know when to resync row heights
  private _lastModuleCount = 0;
  private _lastCatalogCount = 0;
  private _resizeHandler: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private permissionCatalogService: PermissionCatalogService,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.roleId = this.route.snapshot.params['id'];
    if (!this.roleId) {
      this.router.navigate(['/roles']);
      return;
    }

    this.loadData();
  }

  ngAfterViewChecked(): void {
    // If data changed, sync heights
    if (this.modules.length !== this._lastModuleCount || this.permissionCatalogs.length !== this._lastCatalogCount) {
      this._lastModuleCount = this.modules.length;
      this._lastCatalogCount = this.permissionCatalogs.length;
      // Delay to allow DOM render
      setTimeout(() => this.syncRowHeights(), 50);
    }
    // ensure resize listener installed once
    if (!this._resizeHandler) {
      this._resizeHandler = () => this.syncRowHeights();
      window.addEventListener('resize', this._resizeHandler);
    }
  }

  ngOnDestroy(): void {
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
  }

  loadData(): void {
    this.loading = true;

    const requests = {
      role: this.roleService.getById(this.roleId),
      modules: this.moduleService.getAll(),
      catalogs: this.permissionCatalogService.getAll(),
      permissions: this.permissionService.getByRole(this.roleId)
    };

    forkJoin(requests).subscribe({
      next: (data) => {
        this.role = data.role;
        this.modules = data.modules;
        this.permissionCatalogs = data.catalogs;
        this.permissions = data.permissions;
        this.buildPermissionMatrix();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  buildPermissionMatrix(): void {
    // Initialize matrix with all false
    this.modules.forEach(module => {
      this.permissionMatrix[module.id] = {};
      this.permissionCatalogs.forEach(catalog => {
        this.permissionMatrix[module.id][catalog.id] = false;
      });
    });

    // Set existing permissions to true
    this.permissions.forEach(permission => {
      if (permission.module?.id && permission.permissionCatalog?.id) {
        if (!this.permissionMatrix[permission.module.id]) {
          this.permissionMatrix[permission.module.id] = {};
        }
        this.permissionMatrix[permission.module.id][permission.permissionCatalog.id] = true;
      }
    });
  }

  onPermissionChange(moduleId: string, catalogId: string, checked: boolean): void {
    if (!this.permissionMatrix[moduleId]) {
      this.permissionMatrix[moduleId] = {};
    }
    this.permissionMatrix[moduleId][catalogId] = checked;
  }

  savePermissions(): void {
    if (this.saving) return;

    this.saving = true;

    // Build permissions array from matrix
    const newPermissions: any[] = [];

    Object.keys(this.permissionMatrix).forEach(moduleId => {
      Object.keys(this.permissionMatrix[moduleId]).forEach(catalogId => {
        if (this.permissionMatrix[moduleId][catalogId]) {
          newPermissions.push({
            roleId: this.roleId,
            moduleId: moduleId,
            permissionCatalogId: catalogId,
            canRead: true,
            canCreate: this.getCatalogName(catalogId).toLowerCase().includes('crear'),
            canUpdate: this.getCatalogName(catalogId).toLowerCase().includes('editar'),
            canDelete: this.getCatalogName(catalogId).toLowerCase().includes('eliminar')
          });
        }
      });
    });

    // Send permissions to backend
    this.permissionService.updateRolePermissions(this.roleId, newPermissions).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/roles'], {
          queryParams: { message: 'Permisos actualizados correctamente' }
        });
      },
      error: (error) => {
        console.error('Error saving permissions:', error);
        this.saving = false;
      }
    });
  }

  cancelChanges(): void {
    this.router.navigate(['/roles']);
  }

  getCatalogName(catalogId: string): string {
    const catalog = this.permissionCatalogs.find(c => c.id === catalogId);
    return catalog ? catalog.nombre : 'Sin nombre';
  }

  getModuleName(moduleId: string): string {
    const module = this.modules.find(m => m.id === moduleId);
    return module ? module.nombre : 'Sin nombre';
  }

  getPermissionCount(): number {
    let count = 0;
    Object.keys(this.permissionMatrix).forEach(moduleId => {
      Object.keys(this.permissionMatrix[moduleId]).forEach(catalogId => {
        if (this.permissionMatrix[moduleId][catalogId]) {
          count++;
        }
      });
    });
    return count;
  }

  toggleAllForModule(moduleId: string, checked: boolean): void {
    if (!this.permissionMatrix[moduleId]) return;

    Object.keys(this.permissionMatrix[moduleId]).forEach(catalogId => {
      this.permissionMatrix[moduleId][catalogId] = checked;
    });
  }

  isModuleFullySelected(moduleId: string): boolean {
    if (!this.permissionMatrix[moduleId]) return false;

    return Object.values(this.permissionMatrix[moduleId]).every(value => value === true);
  }

  isModulePartiallySelected(moduleId: string): boolean {
    if (!this.permissionMatrix[moduleId]) return false;

    const values = Object.values(this.permissionMatrix[moduleId]);
    return values.some(value => value === true) && !values.every(value => value === true);
  }

  trackByModuleId(index: number, module: any): string {
    return module.id;
  }

  trackByCatalogId(index: number, catalog: any): string {
    return catalog.id;
  }

  private syncRowHeights(): void {
    try {
      const leftRows = Array.from(document.querySelectorAll('.module-row-left')) as HTMLElement[];
      const rightRows = Array.from(document.querySelectorAll('.module-row-right')) as HTMLElement[];
      const count = Math.max(leftRows.length, rightRows.length);
      for (let i = 0; i < count; i++) {
        const left = leftRows[i] as HTMLElement | undefined;
        const right = rightRows[i] as HTMLElement | undefined;
        if (!left || !right) continue;
        // reset heights
        left.style.minHeight = '';
        right.style.minHeight = '';
        const lh = left.getBoundingClientRect().height;
        const rh = right.getBoundingClientRect().height;
        const maxh = Math.max(lh, rh);
        left.style.minHeight = `${maxh}px`;
        right.style.minHeight = `${maxh}px`;
      }
    } catch (err) {
      // ignore
      console.warn('syncRowHeights error', err);
    }
  }
}
