import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleService } from '../../../../core/services/role.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { DynamicPermissionsService } from '../../../../core/services/dynamic-permissions.service';
import { PermissionCheckerService, DynamicModulePermissions } from '../../../../core/services/permission-checker.service';
import { Router } from '@angular/router';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';
import { SearchFilterBarComponent, SearchFilterConfig } from '../../../../shared/components/search-filter-bar/search-filter-bar.component';
import { ActionItem, ActionDropdownConfig } from '../../../../shared/components/action-dropdown/action-dropdown.component';
import { ViewMode } from '../../../../shared/components/view-toggle/view-toggle.component';
import { StandardGridComponent, GridConfig, GridItem } from '../../../../shared/components/standard-grid/standard-grid.component';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-roles-container',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableComponent, SearchFilterBarComponent, StandardGridComponent, DynamicFormComponent],
  templateUrl: './roles-container.component.html',
  styleUrls: ['./roles-container.component.scss']
})
export class RolesContainerComponent implements OnInit {
  roles: any[] = [];
  loading = false;
  error: string | null = null;
  editingId: string | null = null;
  currentUser: any = null;
  userPermissions: any[] = [];
  modulePermissions: DynamicModulePermissions = {};
  rolePermissions: { [key: string]: any[] } = {};
  modalOpen = false;
  isEditing = false;
  success: string | null = null;
  submitting = false;
  roleFormConfig!: DynamicFormConfig;
  roleFormInitialValues: { [key: string]: any } = {};
  currentRolePermisos: string[] = [];

  // Search and filter
  searchTerm = '';
  filteredRoles: any[] = [];
  currentPage = 1;
  pageSize = 6;

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', sortable: true },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'activo', label: 'Estado', type: 'boolean' },
    { key: 'created_at', label: 'Fecha Creación', type: 'date' }
  ];

  searchConfig: SearchFilterConfig = {
    placeholder: 'Buscar roles...',
    showCreateButton: false,
    showViewToggle: true,
    showPagination: true,
    pageSize: this.pageSize,
    totalItems: 0
  };

  // View mode
  currentViewMode: ViewMode = 'table';

  // Template compatibility aliases and getters
  get currentView(): ViewMode {
    return this.currentViewMode;
  }
  set currentView(v: ViewMode) {
    this.currentViewMode = v;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRoles.length / this.pageSize));
  }

  get paginatedRoles(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredRoles.slice(startIndex, endIndex);
  }

  get gridItems(): GridItem[] {
    return this.paginatedRoles.map(r => ({
      id: r.id,
      name: r.nombre,
      description: r.descripcion,
      status: r.activo,
      data: r
    } as GridItem));
  }

  get actionDropdownConfig(): ActionDropdownConfig {
    return this.actionConfig;
  }

  // Provide searchFilterConfig expected by template
  get searchFilterConfig(): SearchFilterConfig {
    return this.searchConfig;
  }

  // Modal form helpers expected by template
  get showForm(): boolean {
    return this.modalOpen;
  }

  openForm(): void {
    this.onCreate();
  }

  closeForm(): void {
    this.modalOpen = false;
    this.isEditing = false;
    this.cancelEdit();
  }

  get cols(): TableColumn[] {
    return this.tableColumns;
  }

  get tableData(): any[] {
    return this.paginatedRoles;
  }

  get tableExtraActions(): ActionItem[] {
    return this.getTableExtraActions();
  }

  // Template event adapters
  onSearchChange(term: string | any) {
    if (typeof term === 'string') {
      this.searchTerm = term;
      this.currentPage = 1;
      this.applyFilters();
    } else {
      this.onSearch(term);
    }
  }
  onViewChange(e: any) { this.onViewModeChange(e); }
  onCreateClick() { this.onCreate(); }
  onPageChange(e: number) { this.currentPage = e; }

  // Grid callbacks
  getRoleActionsForGrid = (item: any) => this.getRoleActions(item);
  onGridEdit(e: any) { this.editRole(e.data || e); }
  onGridAction(e: any) {
    // event from StandardGrid is { action: ActionItem, item: GridItem }
    const action = e?.action || e;
    const gridItem = e?.item || e?.row || e;
    const role = gridItem?.data || gridItem;
    this.onRoleAction(action, role);
  }

  // Action config for dropdown
  get actionConfig(): any {
    return {
      buttonVariant: 'outline',
      position: 'bottom-right',
      maxHeight: '300px'
    };
  }

  getTableExtraActions(): ActionItem[] {
    return this.permissionChecker.getTableExtraActions(this.modulePermissions || []);
  }

  // Grid configuration
  gridConfig: GridConfig = {
    cardHeaderClass: 'role-header',
    gridColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  };

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private authService: AuthService,
    private dynamicPermissionsService: DynamicPermissionsService,
    public permissionChecker: PermissionCheckerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRoles();
    this.loadUserPermissions();
    this.initRoleFormConfig();
  }

  private initRoleFormConfig(): void {
    this.roleFormConfig = {
      submitButton: {
        label: this.editingId ? 'Actualizar' : 'Crear',
        loading: this.submitting
      },
      resetButton: {
        label: 'Cancelar',
        variant: 'secondary'
      },
      fields: [
        {
          key: 'nombre',
          label: 'Nombre',
          type: 'text',
          required: true,
          placeholder: 'Ej: Administrador'
        },
        {
          key: 'descripcion',
          label: 'Descripción',
          type: 'textarea',
          placeholder: 'Descripción del rol'
        },
        {
          key: 'activo',
          label: 'Activo',
          type: 'checkbox',
          value: true
        }
      ]
    };
  }

  private updateRoleFormConfig(): void {
    if (!this.roleFormConfig?.submitButton) return;
    this.roleFormConfig.submitButton.label = this.editingId
      ? (this.submitting ? 'Actualizando...' : 'Actualizar')
      : (this.submitting ? 'Creando...' : 'Crear');
    this.roleFormConfig.submitButton.loading = this.submitting;
  }

  private loadUserPermissions(): void {
    if (this.currentUser?.roleId) {
      this.permissionService.getByRole(this.currentUser.roleId).subscribe({
        next: permissions => {
          this.userPermissions = permissions;
          this.updatePermissions();
          this.updateSearchConfig();
        },
        error: () => this.userPermissions = []
      });
    }
  }

  private updatePermissions(): void {
    this.modulePermissions = this.permissionChecker.checkModulePermissions(
      this.userPermissions,
      'roles'
    );
    this.updateSearchConfig();
  }

  private updateSearchConfig(): void {
    this.searchConfig.showCreateButton = this.permissionChecker.hasPermission(
      this.modulePermissions,
      'Crear'
    );
  }

  private loadRoles(): void {
    this.loading = true;
    this.roleService.getAll().subscribe({
      next: roles => {
        this.roles = roles;
        this.filteredRoles = [...this.roles];
        this.currentPage = 1;
        this.searchConfig.totalItems = this.filteredRoles.length;
        this.loadRolePermissions();
        this.loading = false;
      },
      error: error => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  private loadRolePermissions(): void {
    this.roles.forEach(role => {
      if (role.id) {
        this.permissionService.getByRole(role.id).subscribe({
          next: permissions => {
            this.rolePermissions[role.id] = permissions;
          },
          error: () => {
            this.rolePermissions[role.id] = [];
          }
        });
      }
    });
  }

  onRoleFormSubmit(formData: any): void {
    this.submitting = true;
    this.error = null;
    this.updateRoleFormConfig();

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      activo: !!formData.activo,
      permisos: this.currentRolePermisos
    };

    const request = this.editingId
      ? this.roleService.update(this.editingId, payload)
      : this.roleService.create(payload);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.updateRoleFormConfig();
        this.loadRoles();
        this.closeForm();
      },
      error: (err) => {
        this.submitting = false;
        this.updateRoleFormConfig();
        this.error = err?.error?.message || 'Error guardando rol';
      }
    });
  }

  deleteRole(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este rol?')) {
      this.roleService.delete(id).subscribe({
        next: () => this.loadRoles(),
        error: (err) => console.error(err)
      });
    }
  }

  editRole(role: any): void {
    this.editingId = role.id;
    this.isEditing = true;
    this.roleFormInitialValues = {
      nombre: role.nombre,
      descripcion: role.descripcion,
      activo: role.activo
    };
    this.currentRolePermisos = Array.isArray(role.permisos) ? [...role.permisos] : [];
    this.updateRoleFormConfig();
    this.modalOpen = true;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.isEditing = false;
    this.roleFormInitialValues = {
      nombre: '',
      descripcion: '',
      activo: true
    };
    this.currentRolePermisos = [];
    this.updateRoleFormConfig();
  }

  onSearch(event: { searchTerm: string; statusFilter?: string }): void {
    this.searchTerm = event.searchTerm;
    this.applyFilters();
  }

  onCreate(): void {
    this.modalOpen = true;
    this.isEditing = false;
    this.editingId = null;
    this.roleFormInitialValues = {
      nombre: '',
      descripcion: '',
      activo: true
    };
    this.currentRolePermisos = [];
    this.updateRoleFormConfig();
  }

  private applyFilters(): void {
    this.currentPage = 1;
    this.filteredRoles = this.roles.filter(role => {
      const searchMatch = !this.searchTerm ||
        role.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        role.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return searchMatch;
    });
    this.searchConfig.totalItems = this.filteredRoles.length;
  }

  onViewModeChange(mode: ViewMode): void {
    this.currentViewMode = mode;
  }

  get showCreateButton(): boolean {
    return this.permissionChecker.hasPermission(this.modulePermissions, 'Crear');
  }

  getRoleActions(role: any): ActionItem[] {
    const actions: ActionItem[] = [];
    const availableActions = this.permissionChecker.getAvailableActions(this.modulePermissions || {});

    availableActions.forEach(a => {
      const key = a.key || a.label;
      switch (key) {
        case 'edit':
          if (this.permissionChecker.hasPermission(this.modulePermissions, 'Editar')) {
            actions.push({ key: 'edit', label: 'Editar Rol', icon: 'edit', color: 'primary' });
          }
          break;
        case 'permissions':
          const perms = this.rolePermissions[role?.id] || role?.permissions || [];
          if (perms.length > 0 && this.permissionChecker.hasPermission(this.modulePermissions, 'ConfigurarPermisos')) {
            actions.push({ key: 'permissions', label: 'Configurar Permisos', icon: 'security', color: 'secondary' });
          }
          break;
        case 'details':
          if (this.permissionChecker.hasPermission(this.modulePermissions, 'VerDetalles')) {
            actions.push({ key: 'users', label: 'Ver Usuarios', icon: 'group', color: 'secondary' });
          }
          break;
        case 'delete':
          if (this.permissionChecker.hasPermission(this.modulePermissions, 'Eliminar')) {
            actions.push({ key: 'delete', label: 'Eliminar Rol', icon: 'delete', color: 'danger' });
          }
          break;
        default:
          // map other generic actions if needed
          break;
      }
    });

    return actions;
  }

  onRoleAction(action: ActionItem, role: any): void {
    if (action.disabled) return;

    switch (action.key) {
      case 'edit':
        this.editRole(role);
        break;
      case 'permissions':
        this.navigateToPermissions(role.id);
        break;
      case 'users':
        this.navigateToUsers(role.id);
        break;
      case 'delete':
        this.deleteRole(role.id);
        break;
    }
  }

  onTableAction(event: { key: string; row: any }): void {
    switch (event.key) {
      case 'permissions':
        this.navigateToPermissions(event.row.id);
        break;
      case 'users':
        this.navigateToUsers(event.row.id);
        break;
    }
  }

  private navigateToPermissions(roleId: string): void {
    this.router.navigate(['/roles', roleId, 'permissions']);
  }

  private navigateToUsers(roleId: string): void {
    this.router.navigate(['/users'], {
      queryParams: { roleId }
    });
  }

  getRolePermissionCount(roleId: string): number {
    return (this.rolePermissions[roleId] || []).length;
  }

  getRolePermissionSummary(roleId: string): string {
    const count = this.getRolePermissionCount(roleId);
    return count > 0 ? `${count} permisos asignados` : 'Sin permisos asignados';
  }

  getRoleType(role: any): 'admin' | 'manager' | 'user' {
    const roleName = (role.nombre || role.name || '').toLowerCase();

    if (roleName.includes('admin') || roleName.includes('administrador')) {
      return 'admin';
    }

    if (roleName.includes('manager') || roleName.includes('gerente') || roleName.includes('supervisor')) {
      return 'manager';
    }

    return 'user';
  }
}
