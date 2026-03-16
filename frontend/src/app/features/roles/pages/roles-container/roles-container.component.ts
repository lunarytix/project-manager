import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleService } from '../../../../core/services/role.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { DynamicPermissionsService } from '../../../../core/services/dynamic-permissions.service';
import { PermissionCheckerService, DynamicModulePermissions } from '../../../../core/services/permission-checker.service';
import { Router } from '@angular/router';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';
import { SearchFilterBarComponent, SearchFilterConfig } from '../../../../shared/components/search-filter-bar/search-filter-bar.component';
import { ActionDropdownComponent, ActionItem, ActionDropdownConfig } from '../../../../shared/components/action-dropdown/action-dropdown.component';
import { ViewMode } from '../../../../shared/components/view-toggle/view-toggle.component';
import { StandardGridComponent, GridConfig, GridItem } from '../../../../shared/components/standard-grid/standard-grid.component';

@Component({
  selector: 'app-roles-container',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, GenericTableComponent, SearchFilterBarComponent, StandardGridComponent],
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
  modulePermissions!: DynamicModulePermissions;
  rolePermissions: { [key: string]: any[] } = {};
  modalOpen = false;
  isEditing = false;
  success: string | null = null;
  form: FormGroup;

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
    return Math.ceil(this.filteredRoles.length / this.pageSize);
  }

  get gridItems(): GridItem[] {
    return this.filteredRoles.map(r => ({
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
    return this.filteredRoles;
  }

  get tableExtraActions(): ActionItem[] {
    return this.getTableExtraActions();
  }

  // Template event adapters
  onSearchChange(e: any) { this.onSearch(e); }
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
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private authService: AuthService,
    private dynamicPermissionsService: DynamicPermissionsService,
    public permissionChecker: PermissionCheckerService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRoles();
    this.loadUserPermissions();
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

  saveRole(): void {
    if (this.form.valid) {
      this.loading = true;
      if (this.editingId) {
        // Update existing role
        this.roleService.update(this.editingId, this.form.value).subscribe({
          next: () => {
            this.loadRoles();
            this.cancelEdit();
          },
          error: (err) => console.error(err)
        });
      } else {
        // Create new role
        this.roleService.create(this.form.value).subscribe({
          next: () => {
            this.loadRoles();
            this.form.reset();
          },
          error: (err) => console.error(err)
        });
      }
    }
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
    this.form.patchValue({
      nombre: role.nombre,
      descripcion: role.descripcion,
      activo: role.activo
    });
    // Open modal for editing
    this.modalOpen = true;
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset();
  }

  onSearch(event: { searchTerm: string; statusFilter?: string }): void {
    this.searchTerm = event.searchTerm;
    this.applyFilters();
  }

  onCreate(): void {
    this.modalOpen = true;
    this.isEditing = false;
    this.form.reset({
      nombre: '',
      descripcion: '',
      activo: true
    });
  }

  private applyFilters(): void {
    this.filteredRoles = this.roles.filter(role => {
      const searchMatch = !this.searchTerm ||
        role.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        role.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return searchMatch;
    });
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
