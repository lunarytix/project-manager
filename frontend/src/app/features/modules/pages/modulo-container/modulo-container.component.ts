import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModuleService } from '../../../../core/services/module.service';
import { RoleService } from '../../../../core/services/role.service';
import { DynamicPermissionsService } from '../../../../core/services/dynamic-permissions.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PermissionCheckerService, DynamicModulePermissions } from '../../../../core/services/permission-checker.service';
import { Module } from '../../../../core/models/module.model';
import { Role } from '../../../../core/models/role.model';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { ViewMode, ViewToggleConfig } from '../../../../shared/components/view-toggle/view-toggle.component';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';
import { SearchFilterBarComponent, SearchFilterConfig } from '../../../../shared/components/search-filter-bar/search-filter-bar.component';
import { ActionDropdownComponent, ActionItem, ActionDropdownConfig } from '../../../../shared/components/action-dropdown/action-dropdown.component';
import { StandardGridComponent, GridConfig, GridItem } from '../../../../shared/components/standard-grid/standard-grid.component';

@Component({
  selector: 'app-modulo-container',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, GenericTableComponent, SearchFilterBarComponent, StandardGridComponent],
  templateUrl: './modulo-container.component.html',
  styleUrls: ['./modulo-container.component.scss']
})
export class ModuloContainerComponent implements OnInit {
  modules: Module[] = [];
  roles: Role[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  editingId: string | null = null;
  moduleFormConfig!: DynamicFormConfig;
  showForm = false;

  // Module permissions tracking
  modulePermissions: { [moduleId: string]: any[] } = {};
  checkerPermissions: DynamicModulePermissions = {};
  userPermissions: any = null;
  currentUser: any = null;

  // Search and Pagination
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;

  // View Toggle Properties
  currentView: ViewMode = 'grid';

  // Configurations
  searchFilterConfig: SearchFilterConfig = {
    placeholder: 'Buscar módulos...',
    showCreateButton: true,
    createButtonText: 'Crear Módulo',
    createButtonIcon: 'add',
    showViewToggle: true,
    showPagination: true,
    pageSize: this.pageSize
  };

  viewConfig: ViewToggleConfig = {
    gridLabel: 'Grid',
    tableLabel: 'Table'
  };

  actionDropdownConfig: ActionDropdownConfig = {
    buttonIcon: 'more_vert',
    buttonVariant: 'outline',
    position: 'bottom-right'
  };

  // Grid configuration for StandardGrid
  gridConfig: GridConfig = {
    showIcon: true,
    iconName: 'extension',
    cardHeaderClass: 'module-header',
    gridColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  };

  // Table Configuration
  tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'descripcion', label: 'Descripción', sortable: false },
    { key: 'ruta', label: 'Ruta', sortable: true },
    { key: 'activo', label: 'Estado', sortable: true, type: 'boolean' }
  ];

  constructor(
    private moduleService: ModuleService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private dynamicPermissionsService: DynamicPermissionsService,
    private authService: AuthService,
    public permissionChecker: PermissionCheckerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadModules();
    this.loadRoles();
    this.loadUserPermissions();
    this.setupForm();
  }

  private loadModules(): void {
    this.loading = true;
    this.moduleService.getAll().subscribe({
      next: modules => {
        this.modules = modules;
        this.currentPage = 1;
        this.loading = false;
        this.updateSearchConfig();
        // Load permissions for each module after modules are loaded
        if (this.roles.length > 0) {
          this.loadModulePermissions();
        }
      },
      error: () => {
        this.error = 'Error cargando módulos';
        this.loading = false;
      }
    });
  }

  private loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: roles => {
        this.roles = roles;
        // Load module permissions after both modules and roles are loaded
        if (this.modules.length > 0) {
          this.loadModulePermissions();
        }
      },
      error: () => this.roles = []
    });
  }

  private loadUserPermissions(): void {
    if (this.currentUser?.roleId) {
      this.permissionService.getByRole(this.currentUser.roleId).subscribe({
        next: permissions => {
          this.userPermissions = permissions;
          this.checkerPermissions = this.permissionChecker.checkModulePermissions(
            permissions,
            'Modulos'
          );
          this.updateSearchConfig();
        },
        error: () => {
          this.userPermissions = null;
          this.checkerPermissions = {};
        }
      });
    }
  }

  private loadModulePermissions(): void {
    // Load permissions for each module to show which roles have access
    this.modules.forEach(module => {
      if (module.id) {
        this.permissionService.getByModule(module.id).subscribe({
          next: permissions => {
            this.modulePermissions[module.id!] = permissions;
          },
          error: () => this.modulePermissions[module.id!] = []
        });
      }
    });
  }

  private setupForm(): void {
    this.moduleFormConfig = {
      fields: [
        {
          key: 'nombre',
          type: 'text',
          label: 'Nombre',
          placeholder: 'Ej: Dashboard',
          required: true,
          order: 1
        },
        {
          key: 'descripcion',
          type: 'textarea',
          label: 'Descripción',
          placeholder: 'Descripción del módulo',
          order: 2
        },
        {
          key: 'icono',
          type: 'text',
          label: 'Ícono',
          placeholder: 'Ej: dashboard',
          order: 3
        },
        {
          key: 'ruta',
          type: 'text',
          label: 'Ruta',
          placeholder: 'Ej: /dashboard',
          required: true,
          order: 4
        },
        {
          key: 'activo',
          type: 'checkbox',
          label: 'Activo',
          value: true,
          order: 5
        }
      ],
      submitButton: {
        label: this.editingId ? (this.submitting ? 'Guardando...' : 'Guardar') : (this.submitting ? 'Creando...' : 'Crear'),
        variant: 'primary',
        loading: this.submitting
      },
      resetButton: {
        label: 'Cancelar',
        variant: 'secondary'
      },
      layout: 'vertical'
    };
  }

  onFormSubmit(formValue: any): void {
    this.submitting = true;
    this.error = null;

    const moduleData = {
      ...formValue,
      rolesPermitidos: [] // Handle roles separately if needed
    };

    const operation = this.editingId
      ? this.moduleService.update(this.editingId, moduleData)
      : this.moduleService.create(moduleData);

    operation.subscribe({
      next: () => {
        this.submitting = false;
        this.editingId = null;
        this.showForm = false;
        this.loadModules();
        this.setupForm(); // Reset form
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.message || `Error al ${this.editingId ? 'actualizar' : 'crear'} módulo`;
      }
    });
  }

  onFormReset(): void {
    this.editingId = null;
    this.showForm = false;
    this.setupForm();
  }

  editModule(module: Module): void {
    this.editingId = module.id || null;
    this.showForm = true;

    // Update form with module data
    if (this.moduleFormConfig) {
      this.moduleFormConfig.fields.forEach(field => {
        if ((module as any)[field.key] !== undefined) {
          field.value = (module as any)[field.key];
        }
      });

      // Update buttons
      if (this.moduleFormConfig.submitButton) {
        this.moduleFormConfig.submitButton.label = 'Guardar';
      }
    }
  }

  deleteModule(id: string | undefined): void {
    if (!id || !confirm('¿Estás seguro de eliminar este módulo?')) return;

    this.moduleService.delete(id).subscribe({
      next: () => this.loadModules(),
      error: () => this.error = 'Error al eliminar módulo'
    });
  }

  navigateToCreate(): void {
    if (this.showForm && !this.editingId) {
      // Si el formulario está abierto y es para crear, cancelar
      this.onFormReset();
    } else {
      // Mostrar formulario de creación
      this.editingId = null;
      this.showForm = true;
      this.setupForm();
    }
  }

  navigateToEdit(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/modules/edit', id]);
    }
  }

  // Table event handlers
  onTableEdit(module: Module): void {
    this.editModule(module);
  }

  onTableDelete(module: Module): void {
    this.deleteModule(module.id);
  }

  onTableAction(event: { key: string; row: any }): void {
    const module = this.modules.find(m => m.id === event.row.id);
    if (!module) return;

    switch (event.key) {
      case 'toggle-status':
        this.toggleModuleStatus(module);
        break;
      case 'permissions':
        this.navigateToPermissions(module.id);
        break;
    }
  }

  // Prepare data for table (uses filteredModules so search-filter-bar works for table too)
  get tableData(): any[] {
    return this.paginatedModules.map(module => ({
      ...module,
      activo: module.activo ? 'Activo' : 'Inactivo'
    }));
  }

  // Search and Filter Methods
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 1; // Reset to first page when searching
    this.updateSearchConfig();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onViewChange(view: ViewMode): void {
    this.currentView = view;
  }

  onCreateClick(): void {
    this.navigateToCreate();
  }

  // Filtered and Paginated Modules
  get filteredModules(): Module[] {
    if (!this.searchTerm) return this.modules;

    const term = this.searchTerm.toLowerCase();
    return this.modules.filter(module =>
      module.nombre.toLowerCase().includes(term) ||
      (module.descripcion || '').toLowerCase().includes(term) ||
      module.ruta.toLowerCase().includes(term)
    );
  }

  get paginatedModules(): Module[] {
    const filtered = this.filteredModules;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredModules.length / this.pageSize));
  }

  // Update search config when data changes
  updateSearchConfig(): void {
    this.searchFilterConfig = {
      ...this.searchFilterConfig,
      totalItems: this.filteredModules.length,
      showCreateButton: this.hasPermissionForAction('create')
    };
  }

  // Handle action clicks
  onModuleAction(action: ActionItem, module: Module): void {
    switch (action.key) {
      case 'edit':
        this.editModule(module);
        break;
      case 'permissions':
        this.navigateToEdit(module.id);
        break;
      case 'navigate':
        // Navigate to module route
        window.open(module.ruta, '_blank');
        break;
      case 'toggle-status':
        this.toggleModuleStatus(module);
        break;
      case 'delete':
        this.deleteModule(module.id);
        break;
    }
  }

  // Toggle module status
  toggleModuleStatus(module: Module): void {
    if (!module.id) return;

    const updatedModule = { ...module, activo: !module.activo };
    this.moduleService.update(module.id, updatedModule).subscribe({
      next: () => this.loadModules(),
      error: () => this.error = 'Error al actualizar estado del módulo'
    });
  }

  // Permission-related methods
  getPermissionSummary(moduleId: string): string {
    const count = this.getModulePermissionCount(moduleId);
    return count > 0 ? `${count} permisos configurados` : 'Sin permisos configurados';
  }

  getModuleRoles(moduleId: string): Role[] {
    const permissions = this.modulePermissions[moduleId] || [];
    const roleIds = [...new Set(permissions.map(p => p.role?.id).filter(id => id))];
    return this.roles.filter(role => roleIds.includes(role.id!));
  }

  getModulePermissionCount(moduleId: string): number {
    return (this.modulePermissions[moduleId] || []).length;
  }

  // Convert modules to GridItems for StandardGridComponent
  get gridItems(): GridItem[] {
    return this.paginatedModules.map(module => ({
      id: module.id || '',
      name: module.nombre,
      description: module.descripcion || 'Sin descripción',
      status: module.activo,
      statusText: module.activo ? 'Activo' : 'Inactivo',
      icon: module.icono || 'extension',
      route: module.ruta,
      originalData: module
    }));
  }

  // Actions provider for StandardGridComponent (arrow function to preserve 'this' context)
  getModuleActionsForGrid = (item: GridItem): ActionItem[] => {
    const module = item['originalData'] as Module;
    const hasEditPermission = this.permissionChecker.hasPermission(this.checkerPermissions, 'Editar');
    const hasDeletePermission = this.permissionChecker.hasPermission(this.checkerPermissions, 'Eliminar');

    const actions: ActionItem[] = [
      {
        key: 'view',
        label: 'Ver Detalles',
        icon: 'visibility',
        color: 'primary' as const
      },
      {
        key: 'edit',
        label: 'Editar Módulo',
        icon: 'edit',
        color: 'primary' as const,
        disabled: !hasEditPermission
      },
      {
        key: 'permissions',
        label: 'Configurar Permisos',
        icon: 'shield',
        color: 'secondary' as const
      },
      {
        key: 'navigate',
        label: 'Ir al Módulo',
        icon: 'launch',
        color: 'success' as const
      },
      {
        key: 'toggle-status',
        label: module.activo ? 'Desactivar' : 'Activar',
        icon: module.activo ? 'visibility_off' : 'visibility',
        color: module.activo ? ('warning' as const) : ('success' as const),
        disabled: !hasEditPermission
      },
      {
        key: 'separator',
        label: '',
        separator: true
      },
      {
        key: 'delete',
        label: 'Eliminar Módulo',
        icon: 'delete',
        color: 'danger' as const,
        disabled: !hasDeletePermission
      }
    ];

    return actions.filter(action => !action.hidden);
  }

  // Check if current user has permission for specific action
  private hasPermissionForAction(action: 'create' | 'update' | 'delete' | 'read'): boolean {
    const map: Record<string, string> = {
      create: 'Crear',
      update: 'Editar',
      delete: 'Eliminar',
      read: 'Leer'
    };
    return this.permissionChecker.hasPermission(this.checkerPermissions, map[action] || action);
  }

  // Event handlers for StandardGridComponent
  onGridEdit(item: GridItem): void {
    const module = item['originalData'] as Module;
    this.editModule(module);
  }

  onGridAction(event: { action: ActionItem, item: GridItem }): void {
    const module = event.item['originalData'] as Module;

    switch (event.action.key) {
      case 'view':
        this.viewModuleDetails(module);
        break;
      case 'edit':
        if (!event.action.disabled) {
          this.editModule(module);
        }
        break;
      case 'permissions':
        this.navigateToPermissions(module.id);
        break;
      case 'navigate':
        if (module.ruta) {
          window.open(module.ruta, '_blank');
        }
        break;
      case 'toggle-status':
        if (!event.action.disabled) {
          this.toggleModuleStatus(module);
        }
        break;
      case 'delete':
        if (!event.action.disabled) {
          this.deleteModule(module.id);
        }
        break;
    }
  }

  private viewModuleDetails(module: Module): void {
    // For now, just edit - could be a modal or detail view in future
    console.log('Viewing module details:', module);
  }

  private navigateToPermissions(moduleId: string | undefined): void {
    if (moduleId) {
      this.router.navigate(['/permissions'], {
        queryParams: { moduleId }
      });
    }
  }
}
