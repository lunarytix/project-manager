import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditService } from '../../../../core/services/audit.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AuditLog, AuditLogFilters, AuditSettings } from '../../../../core/models/audit.model';
import { FrontendAuditService } from '../../../../core/services/frontend-audit.service';

@Component({
  selector: 'app-audit-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-panel.component.html',
  styleUrls: ['./audit-panel.component.scss']
})
export class AuditPanelComponent implements OnInit {
  loadingSettings = false;
  loadingLogs = false;
  savingSettings = false;
  error: string | null = null;

  settings: AuditSettings | null = null;
  logs: AuditLog[] = [];
  total = 0;
  page = 1;
  pageSize = 50;
  totalPages = 1;

  filters: AuditLogFilters = {
    moduleRuta: '',
    method: '',
    actionType: '',
    page: 1,
    pageSize: 50,
  };

  constructor(
    private readonly auditService: AuditService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly frontendAudit: FrontendAuditService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!this.canAccessAuditPanel(user)) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadSettings();
    this.loadLogs();
  }

  private isAdmin(user: any): boolean {
    const roleName = (user?.roleName || '').toString().toLowerCase();
    const roleId = (user?.roleId || '').toString().toLowerCase();
    return roleName === 'admin' || roleName === 'administrador' || roleId === 'admin';
  }

  private isUuid(value?: string): boolean {
    if (!value) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private canAccessAuditPanel(user: any): boolean {
    if (this.isAdmin(user)) return true;

    // On bootstrap roleName may not be hydrated yet (only UUID in roleId).
    // In that case, allow entering and let backend enforce admin permissions.
    const roleName = (user?.roleName || '').toString().trim();
    const roleId = (user?.roleId || '').toString().trim();
    const hasPendingRoleHydration = this.isUuid(roleId) && (!roleName || this.isUuid(roleName));

    return hasPendingRoleHydration;
  }

  loadSettings(): void {
    this.loadingSettings = true;
    this.error = null;

    this.auditService.getSettings().subscribe({
      next: (settings) => {
        this.settings = settings;
        this.loadingSettings = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo cargar la configuracion de auditoria';
        this.loadingSettings = false;
      }
    });
  }

  saveSettings(): void {
    if (!this.settings) return;

    this.savingSettings = true;
    this.error = null;

    this.auditService.updateSettings({
      debugModeEnabled: !!this.settings.debugModeEnabled,
      trackReadQueries: !!this.settings.trackReadQueries,
    }).subscribe({
      next: (settings) => {
        this.settings = settings;
        this.savingSettings = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo guardar la configuracion';
        this.savingSettings = false;
      }
    });
  }

  loadLogs(): void {
    this.loadingLogs = true;
    this.error = null;

    const normalized: AuditLogFilters = {
      ...this.filters,
      method: this.filters.method ? this.filters.method.toUpperCase() : undefined,
      page: this.page,
      pageSize: this.pageSize,
    };

    this.auditService.getLogs(normalized).subscribe({
      next: (response) => {
        this.logs = response.items;
        this.total = response.total;
        this.page = response.page;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.loadingLogs = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudieron cargar los logs';
        this.loadingLogs = false;
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      moduleRuta: '',
      method: '',
      actionType: '',
      page: 1,
      pageSize: this.pageSize,
    };
    this.page = 1;
    this.loadLogs();

    this.frontendAudit.logAction('Limpio filtros de auditoria', {
      pageSize: this.pageSize,
    }, 'AuditPanelComponent');
  }

  applyFilters(): void {
    this.page = 1;
    this.loadLogs();

    this.frontendAudit.logAction('Aplico filtros de auditoria', {
      moduleRuta: this.filters.moduleRuta || null,
      method: this.filters.method || null,
      actionType: this.filters.actionType || null,
      pageSize: this.pageSize,
    }, 'AuditPanelComponent');
  }

  changePage(delta: number): void {
    const nextPage = this.page + delta;
    if (nextPage < 1 || nextPage > this.totalPages) return;
    this.page = nextPage;
    this.loadLogs();
  }

  onPageSizeChange(): void {
    this.page = 1;
    this.loadLogs();
  }

  formatJson(value: string | null | undefined): string {
    if (!value) return '-';
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return value;
    }
  }
}
