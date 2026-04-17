import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ModuleService } from '../../../../core/services/module.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { PermissionCheckerService } from '../../../../core/services/permission-checker.service';
import { Module as AppModule } from '../../../../core/models/module.model';
import { FrontendAuditService } from '../../../../core/services/frontend-audit.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  usuario: any = null;
  modules: AppModule[] = [];
  visibleModules: AppModule[] = [];
  userPermissions: any[] = [];
  loading = false;

  ngOnInit(): void {
    this.modules = [];
    this.visibleModules = [];
    this.usuario = this.auth.getCurrentUser();
    this.loadUserPermissionsAndModules();
  }

  constructor(
    private auth: AuthService,
    private moduleService: ModuleService,
    private permissionService: PermissionService,
    private permissionChecker: PermissionCheckerService,
    private frontendAudit: FrontendAuditService,
    private router: Router
  ) {}

  loadUserPermissionsAndModules(): void {
    this.loading = true;

    if (this.usuario?.roleId) {
      this.permissionService.getByRole(this.usuario.roleId).subscribe({
        next: (permissions) => {
          this.userPermissions = permissions;
          this.loadAllModules();
        },
        error: (err) => {
          console.error('Error loading permissions:', err);
          this.loading = false;
        }
      });
    } else {
      this.loadAllModules();
    }
  }

  loadAllModules(): void {
    this.moduleService.getAll().subscribe({
      next: (mods) => {
        this.modules = mods.filter(m => m.activo);
        // Filter modules based on Vista permission
        this.visibleModules = this.permissionChecker.filterVisibleModules(
          this.modules,
          this.userPermissions
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading modules:', err);
        this.loading = false;
      }
    });
  }

  navigateTo(ruta: string): void {
    if (ruta) {
      const selectedModule = this.visibleModules.find(m => m.ruta === ruta);
      this.frontendAudit.logAction('Seleccion de modulo desde dashboard', {
        moduleRuta: ruta,
        moduleNombre: selectedModule?.nombre || null,
      }, 'DashboardComponent');
      this.router.navigate([ruta]);
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
