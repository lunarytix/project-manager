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
import { ActionDropdownComponent, ActionItem, ActionDropdownConfig } from '../../../../shared/components/action-dropdown/action-dropdown.component';
import { ViewMode } from '../../../../shared/components/view-toggle/view-toggle.component';

@Component({
  selector: 'app-usuario-container',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, GenericTableComponent, SearchFilterBarComponent, ActionDropdownComponent],
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
  currentView: ViewMode = 'grid';
  showForm = false;
  currentUser: any = null;
  userPermissions: any[] = [];
  modulePermissions: DynamicModulePermissions = {};

  // Search and Pagination
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  filteredUsers: User[] = [];


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


  onSearchChange(e: any) { this.onSearch(e); }
  onViewChange(e: any) { this.currentView = e; }
  onCreateClick() { this.onCreate(); }
  onPageChange(p: number) { this.currentPage = p; }

  onFormReset(): void { this.showForm = false; this.editingId = null; }

  getRoleName(roleId: string | undefined): string {
    const r = this.roles.find(x => x.id === roleId);
    return r ? (r.nombre || '') : '';
  }

  get tableData(): any[] { return this.filteredUsers; }
  get tableExtraActions(): ActionItem[] { return this.getTableExtraActions(); }
  get actionDropdownConfig(): any { return {
    buttonVariant: 'outline', position: 'bottom-right'
  }; }

  onTableEdit(e: any) { this.editUser(e); }
  onTableDelete(e: any) { this.deleteUser(e.id); }

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
    return actions;
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
    this.loadUsers();
    this.loadRoles();
    this.loadUserPermissions();
    this.initUserFormConfig();
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
    this.showForm = true;
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredUsers.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
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
    const availableActions = this.permissionChecker.getAvailableActions(this.modulePermissions);

    availableActions.forEach(action => {
      switch (action) {
        case 'Editar':
          if (this.permissionChecker.hasPermission(this.modulePermissions, 'Editar')) {
            actions.push({
              key: 'edit',
              label: 'Editar Usuario',
              icon: 'edit',
              color: 'primary'
            });
          }
          break;
        case 'ConfigurarPermisos':
          if (this.permissionChecker.hasPermission(this.modulePermissions, 'ConfigurarPermisos')) {
            actions.push({
              key: 'permissions',
              label: 'Configurar Permisos',
              icon: 'security',
              color: 'secondary'
            });
          }
          break;
        case 'Habilitar':
        case 'Deshabilitar':
          if (this.permissionChecker.hasPermission(this.modulePermissions, user.activo ? 'Deshabilitar' : 'Habilitar')) {
            actions.push({
              key: 'toggle-status',
              label: user.activo ? 'Deshabilitar' : 'Habilitar',
              icon: user.activo ? 'toggle_off' : 'toggle_on',
              color: user.activo ? 'warning' : 'success'
            });
          }
          break;
        case 'Eliminar':
          if (this.permissionChecker.hasPermission(this.modulePermissions, 'Eliminar')) {
            actions.push({
              key: 'delete',
              label: 'Eliminar Usuario',
              icon: 'delete',
              color: 'danger'
            });
          }
          break;
      }
    });

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
