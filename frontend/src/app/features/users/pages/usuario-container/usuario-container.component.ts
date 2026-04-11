import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { RoleService } from '../../../../core/services/role.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PermissionCheckerService, DynamicModulePermissions } from '../../../../core/services/permission-checker.service';
import { User } from '../../../../core/models/user.model';
import { Role } from '../../../../core/models/role.model';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';
import { SearchFilterBarComponent, SearchFilterConfig } from '../../../../shared/components/search-filter-bar/search-filter-bar.component';
import { ActionItem, ActionDropdownConfig } from '../../../../shared/components/action-dropdown/action-dropdown.component';
import { ViewMode } from '../../../../shared/components/view-toggle/view-toggle.component';
import { StandardGridComponent, GridConfig, GridItem } from '../../../../shared/components/standard-grid/standard-grid.component';

@Component({
  selector: 'app-usuario-container',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, GenericTableComponent, SearchFilterBarComponent, StandardGridComponent],
  templateUrl: './usuario-container.component.html',
  styleUrls: ['./usuario-container.component.scss']
})
export class UsuarioContainerComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  editingId: string | null = null;
  userFormConfig!: DynamicFormConfig;
  formInitialValues: { [key: string]: any } = {};
  currentView: ViewMode = 'grid';
  showForm = false;
  currentUser: any = null;
  userPermissions: any[] = [];
  modulePermissions: DynamicModulePermissions = {};
  showPermissionDebug = false;

  // Search and Pagination
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  filteredUsers: User[] = [];

  // Grid configuration
  gridConfig: GridConfig = {
    cardHeaderClass: 'module-header',
    showIcon: true,
    iconName: 'person',
    gridColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  };

  get gridItems(): GridItem[] {
    return this.paginatedUsers.map(u => ({
      id: u.id || '',
      name: u.nombre,
      description: u.email,
      status: u.activo,
      icon: 'person',
      roleId: u.roleId
    } as GridItem));
  }

  getUserActionsForGrid = (item: GridItem): ActionItem[] => {
    const user = this.users.find(u => u.id === item.id);
    if (!user) return [];
    return this.getUserActions(user);
  };


  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', sortable: true },
    { key: 'email', label: 'Email', type: 'text', sortable: true },
    { key: 'role_name', label: 'Rol', type: 'text' },
    { key: 'activo', label: 'Estado', type: 'boolean' },
    { key: 'created_at', label: 'Fecha Creación', type: 'date' }
  ];

  // control for whether current user can create
  canCreate = false;

  // Action config for dropdown

  // Template compatibility aliases
  get searchFilterConfig(): SearchFilterConfig {
    return {
      placeholder: 'Buscar usuarios...',
      showCreateButton: this.showCreateButton,
      showViewToggle: true,
      showPagination: true,
      pageSize: this.pageSize,
      totalItems: this.filteredUsers.length
    };
  }


  onSearchChange(term: string | any) {
    if (typeof term === 'string') {
      this.searchTerm = term;
      this.currentPage = 1;
      this.applyFilters();
    } else {
      this.onSearch(term);
    }
  }
  onViewChange(e: any) { this.currentView = e; }
  onCreateClick() { this.onCreate(); }
  onPageChange(p: number) { this.currentPage = p; }

  onFormReset(): void { this.showForm = false; this.editingId = null; }

  getRoleName(roleId: string | undefined): string {
    const r = this.roles.find(x => x.id === roleId);
    return r ? (r.nombre || '') : '';
  }

  get tableData(): any[] {
    return this.paginatedUsers.map(user => ({
      ...user,
      role_name: this.getRoleName(user.roleId),
      created_at: user.fechaCreacion || user.createdAt || ''
    }));
  }
  get tableExtraActions(): ActionItem[] { return this.getTableExtraActions(); }
  get actionDropdownConfig(): any { return {
    buttonVariant: 'outline', position: 'bottom-right'
  }; }

  onTableEdit(e: any) { this.editUser(e); }
  onTableDelete(e: any) { this.deleteUser(e.id); }

  onGridEdit(item: GridItem): void {
    const user = this.users.find(u => u.id === item.id);
    if (user) this.editUser(user);
  }

  onGridAction(event: { action: ActionItem, item: GridItem }): void {
    const user = this.users.find(u => u.id === event.item.id);
    if (!user) return;
    this.onUserAction(event.action, user);
  }

  getTableExtraActions(): ActionItem[] {
    const actions: ActionItem[] = [];
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'ConfigurarPermisos')) {
      actions.push({
        key: 'permissions',
        label: 'Configurar Permisos',
        icon: 'security',
        color: 'secondary'
      });
    }
    // Deduplicate by key then by label to avoid showing duplicate entries
    const seenKeys = new Set<string>();
    const seenLabels = new Set<string>();
    let deduped: ActionItem[] = [];

    actions.forEach(a => {
      const k = a.key || '';
      const label = (a.label || '').toString();
      if (k && seenKeys.has(k)) return;
      if (label && seenLabels.has(label)) return;
      if (k) seenKeys.add(k);
      if (label) seenLabels.add(label);
      deduped.push(a);
    });

    // Special-case collapse: if there are multiple entries for enable/disable
    const normalize = (s: string) => s.toString().trim().toLowerCase();
    const isToggleLabel = (s: string) => {
      const n = normalize(s);
      return n.includes('habilitar') || n.includes('deshabilitar');
    };

    const toggleGroups: {[k: string]: ActionItem[]} = {};
    deduped.forEach(a => {
      const key = normalize(a.label || a.key || '');
      if (!toggleGroups[key]) toggleGroups[key] = [];
      toggleGroups[key].push(a);
    });

    Object.keys(toggleGroups).forEach(k => {
      if (!isToggleLabel(k)) return;
      const group = toggleGroups[k];
      if (group.length <= 1) return;

      // prefer item with key 'toggle-status' or icon containing 'toggle'
      let preferred = group.find(x => x.key === 'toggle-status')
        || group.find(x => (x.icon || '').toString().includes('toggle'))
        || group[0];

      // remove all group items and put only preferred
      deduped = deduped.filter(x => !group.includes(x));
      deduped.push(preferred);
    });

    return deduped;
  }

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private authService: AuthService,
    public permissionChecker: PermissionCheckerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // If auth state changes later (async init), re-load permissions
    this.authService.authState$.subscribe(state => {
      if (state && (state as any).usuario) {
        this.currentUser = (state as any).usuario;
        this.loadUserPermissions();
      }
    });

    this.loadUsers();
    this.loadRoles();

    // Try loading permissions immediately if currentUser already available
    if (this.currentUser) {
      this.loadUserPermissions();
    }

    this.initUserFormConfig();
  }

  private loadUserPermissions(): void {
    const roleId = this.currentUser?.roleId;
    console.debug('[Users] loadUserPermissions start, currentUser:', this.currentUser);

    if (!roleId) {
      console.warn('[Users] No roleId found for currentUser, skipping permission fetch.');
      this.userPermissions = [];
      this.updatePermissions();
      this.updateSearchConfig();
      return;
    }

    this.permissionService.getByRole(roleId).subscribe({
      next: permissions => {
        console.debug('[Users] permissions response for role', roleId, permissions);
        this.userPermissions = permissions || [];
        this.updatePermissions();
        this.updateSearchConfig();
      },
      error: err => {
        console.error('[Users] error loading permissions for role', roleId, err);
        this.userPermissions = [];
        this.updatePermissions();
        this.updateSearchConfig();
      }
    });
  }

  private updatePermissions(): void {
    this.modulePermissions = this.permissionChecker.checkModulePermissions(
      this.userPermissions,
      'users'
    );
  }

  private updateSearchConfig(): void {
    this.canCreate = this.permissionChecker.hasPermission(
      this.modulePermissions,
      'Crear'
    );
  }

  private loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: users => {
        this.users = users;
        this.filteredUsers = [...this.users];
        this.currentPage = 1;
        this.loading = false;
      },
      error: error => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  private loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: roles => {
        this.roles = roles;
        this.initUserFormConfig();
      },
      error: error => {
        console.error('Error loading roles:', error);
      }
    });
  }

  private initUserFormConfig(): void {
    this.userFormConfig = {
      submitButton: { label: this.editingId ? 'Actualizar' : 'Crear' },
      fields: [
        {
          key: 'nombre',
          label: 'Nombre',
          type: 'text',
          required: true
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          validation: { email: true }
        },
        {
          key: 'password',
          label: 'Contraseña',
          type: 'password',
          required: !this.editingId,
          validation: { minLength: 6 }
        },
        {
          key: 'roleId',
          label: 'Rol',
          type: 'select',
          required: true,
          options: this.roles.map(role => ({ value: role.id, label: role.nombre })),
          validation: {}
        },
        {
          key: 'activo',
          label: 'Activo',
          type: 'checkbox',
          value: true
        }
      ]
      } as any; // cast because DynamicFormConfig in this codebase is minimal

    if (!this.editingId) {
      this.formInitialValues = {
        nombre: '',
        email: '',
        password: '',
        roleId: '',
        activo: true
      };
    }
  }

  onFormSubmit(formData: any): void {
    this.submitting = true;
    this.error = null;

    const userData = { ...formData };
    if (!userData.password && this.editingId) {
      delete userData.password;
    }

    const serviceCall = this.editingId
      ? this.userService.update(this.editingId, userData)
      : this.userService.create(userData);

    serviceCall.subscribe({
      next: () => {
        this.loadUsers();
        this.showForm = false;
        this.editingId = null;
        this.submitting = false;
      },
      error: error => {
        this.error = error.message;
        this.submitting = false;
      }
    });
  }

  editUser(user: User): void {
    this.editingId = user.id!;
    this.initUserFormConfig();
    this.formInitialValues = {
      nombre: user.nombre || '',
      email: user.email || '',
      password: '',
      roleId: user.roleId || '',
      activo: !!user.activo
    };
    this.showForm = true;
  }

  deleteUser(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: error => this.error = error.message
      });
    }
  }

  onSearch(event: { searchTerm: string; statusFilter?: string }): void {
    this.searchTerm = event.searchTerm;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.currentPage = 1;
    this.filteredUsers = this.users.filter(user => {
      const searchMatch = !this.searchTerm ||
        user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      return searchMatch;
    });
  }

  onCreate(): void {
    this.editingId = null;
    this.initUserFormConfig();
    this.formInitialValues = {
      nombre: '',
      email: '',
      password: '',
      roleId: '',
      activo: true
    };
    this.showForm = true;
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredUsers.slice(start, end);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get showCreateButton(): boolean {
    return this.canCreate;
  }

  navigateToPermissions(userId: string): void {
    this.router.navigate(['/users', userId, 'permissions']);
  }

  navigateToCreate(): void {
    this.onCreate();
  }

  onTableAction(event: { key: string; row: any }): void {
    const user = this.users.find(u => u.id === event.row.id);
    if (!user) return;

    switch (event.key) {
      case 'permissions':
        this.navigateToPermissions(user.id!);
        break;
      case 'toggle-status':
        this.toggleUserStatus(user);
        break;
    }
  }

  getUserActions(user: User): ActionItem[] {
    const actions: ActionItem[] = [];
    const availableActions = this.permissionChecker.getAvailableActions(this.modulePermissions) || [];

    // availableActions returns objects: { key, label, icon, color }
    let toggleAdded = false;
    availableActions.forEach(a => {
      const key = a?.key;

      // Handle toggle action once only (enable/disable)
      if ((key === 'enable' || key === 'disable' || key === 'toggle-status') && !toggleAdded) {
        const wantsToDisable = user.activo === true;
        const hasDisablePerm = this.permissionChecker.hasPermission(this.modulePermissions, 'Deshabilitar');
        const hasEnablePerm = this.permissionChecker.hasPermission(this.modulePermissions, 'Habilitar');

        if ((wantsToDisable && hasDisablePerm) || (!wantsToDisable && hasEnablePerm)) {
          actions.push({
            key: 'toggle-status',
            label: wantsToDisable ? 'Deshabilitar' : 'Habilitar',
            icon: wantsToDisable ? 'toggle_off' : 'toggle_on',
            color: wantsToDisable ? 'warning' : 'success'
          });
          toggleAdded = true;
        }

        return;
      }

      switch (key) {
        case 'edit':
          actions.push({ key: 'edit', label: a.label || 'Editar', icon: a.icon || 'edit', color: a.color || 'primary' });
          break;
        case 'permissions':
          actions.push({ key: 'permissions', label: a.label || 'Configurar Permisos', icon: a.icon || 'security', color: a.color || 'secondary' });
          break;
        case 'delete':
          actions.push({ key: 'delete', label: a.label || 'Eliminar', icon: a.icon || 'delete', color: a.color || 'danger' });
          break;
        case 'details':
          actions.push({ key: 'details', label: a.label || 'Ver detalles', icon: a.icon || 'info', color: a.color || 'secondary' });
          break;
        default:
          // Fallback: add the action as-is
          if (key) {
            actions.push({ key, label: a.label || key, icon: a.icon, color: a.color as any });
          }
      }
    });

    // Debug: log available action objects and the computed actions to help diagnose duplicates
    console.debug('[Users] getUserActions - availableActions:', availableActions, 'computed actions:', actions, 'user:', { id: user?.id, activo: user?.activo });

    return actions;
  }

  onUserAction(action: ActionItem, user: User): void {
    switch (action.key) {
      case 'edit':
        this.editUser(user);
        break;
      case 'permissions':
        this.navigateToPermissions(user.id!);
        break;
      case 'toggle-status':
        this.toggleUserStatus(user);
        break;
      case 'delete':
        this.deleteUser(user.id!);
        break;
    }
  }

  // Toggle user status
  toggleUserStatus(user: User): void {
    if (!user.id) return;

    const updatedUser = { ...user, activo: !user.activo };
    this.userService.update(user.id, updatedUser).subscribe({
      next: () => this.loadUsers(),
      error: () => this.error = 'Error al actualizar estado del usuario'
    });
  }
}
