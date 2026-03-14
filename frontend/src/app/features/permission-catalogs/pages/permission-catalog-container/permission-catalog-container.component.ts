import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionCheckerService, DynamicModulePermissions } from '../../../../core/services/permission-checker.service';
import { PermissionCatalogService } from '../../../../core/services/permission-catalog.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';
import { SearchFilterBarComponent, SearchFilterConfig } from '../../../../shared/components/search-filter-bar/search-filter-bar.component';
import { ActionItem } from '../../../../shared/components/action-dropdown/action-dropdown.component';
import { ViewMode } from '../../../../shared/components/view-toggle/view-toggle.component';
import { StandardGridComponent, GridConfig, GridItem } from '../../../../shared/components/standard-grid/standard-grid.component';

@Component({
  selector: 'app-permission-catalog-container',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    GenericTableComponent,
    SearchFilterBarComponent,

    StandardGridComponent
  ],
  templateUrl: './permission-catalog-container.component.html',
  styleUrls: ['./permission-catalog-container.component.scss']
})
export class PermissionCatalogContainerComponent implements OnInit {
  catalogs: any[] = [];
  loading = false;
  modulePermissions: DynamicModulePermissions = {};
  currentUser: any = null;
  userPermissions: any = null;

  // Search and Pagination
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  filteredCatalogs: any[] = [];
  currentView: ViewMode = 'table';

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'id', label: 'ID' }
  ];

  // Grid configuration
  gridConfig: GridConfig = {
    cardHeaderClass: 'catalog-header',
    gridColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  };

  searchFilterConfig!: SearchFilterConfig;

  constructor(
    private permissionCatalogService: PermissionCatalogService,
    public permissionChecker: PermissionCheckerService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUserPermissions();
    this.initializeSearchFilterConfig();
    this.loadCatalogs();
  }

  private loadUserPermissions(): void {
    if (this.currentUser?.roleId) {
      this.permissionService.getByRole(this.currentUser.roleId).subscribe({
        next: permissions => {
          this.userPermissions = permissions;
          this.updatePermissions();
        },
        error: () => this.userPermissions = null
      });
    }
  }

  private updatePermissions(): void {
    this.modulePermissions = this.permissionChecker.checkModulePermissions(
      this.userPermissions,
      'CatalogoPermisos'
    );
    this.initializeSearchFilterConfig(); // Re-initialize after permissions are loaded
    // Ensure catalogs are loaded after permissions are available
    this.loadCatalogs();
  }

  private initializeSearchFilterConfig() {
    this.searchFilterConfig = {
      placeholder: 'Buscar catálogos de permisos...',
      showCreateButton: this.permissionChecker.hasPermission(this.modulePermissions, 'Crear'),
      createButtonText: 'Nuevo Catálogo',
      createButtonIcon: 'add_box',
      showViewToggle: true,
      showPagination: true,
      pageSize: this.pageSize
    };
  }

  loadCatalogs() {
    if (!this.permissionChecker.hasPermission(this.modulePermissions, 'Vista')) {
      console.warn('No tiene permisos para ver la lista de catálogos de permisos');
      return;
    }

    this.loading = true;
    this.permissionCatalogService.getAll().subscribe({
      next: (data) => {
        this.catalogs = data;
        this.filteredCatalogs = [...this.catalogs];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando catálogos:', error);
        this.loading = false;
      }
    });
  }

  getCatalogActions(catalog: any): ActionItem[] {
    return this.permissionChecker.getAvailableActions(this.modulePermissions).map(action => {
      const actionMap: { [key: string]: ActionItem } = {
        'VerDetalles': {
          key: 'view',
          label: 'Ver Detalles',
          icon: 'visibility'
        },
        'Leer': {
          key: 'read',
          label: 'Leer',
          icon: 'description'
        },
        'Editar': {
          key: 'edit',
          label: 'Editar',
          icon: 'edit'
        },
        'Eliminar': {
          key: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          color: 'danger'
        },
        'ConfigurarPermisos': {
          key: 'permissions',
          label: 'Configurar Permisos',
          icon: 'security'
        },
        'Habilitar': {
          key: 'enable',
          label: 'Habilitar',
          icon: 'check_circle'
        },
        'Deshabilitar': {
          key: 'disable',
          label: 'Deshabilitar',
          icon: 'cancel',
          color: 'danger'
        },
        'descargar': {
          key: 'download',
          label: 'Descargar',
          icon: 'download'
        }
      };

      return actionMap[action];
    }).filter(action => action !== undefined);
  }

  getTableExtraActions(): ActionItem[] {
    return this.permissionChecker.getTableExtraActions(this.modulePermissions);
  }

  // Action methods
  createCatalog() {
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'Crear')) {
      this.router.navigate(['create'], { relativeTo: this.route });
    }
  }

  viewCatalog(id: string) {
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'VerDetalles')) {
      this.router.navigate(['view', id], { relativeTo: this.route });
    }
  }

  readCatalog(id: string) {
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'Leer')) {
      // Implementar lógica de lectura
      console.log('Leyendo catálogo:', id);
    }
  }

  editCatalog(id: string) {
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'Editar')) {
      this.router.navigate(['edit', id], { relativeTo: this.route });
    }
  }

  deleteCatalog(id: string) {
    if (!this.permissionChecker.hasPermission(this.modulePermissions, 'Eliminar')) {
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar este catálogo de permisos?')) {
      this.permissionCatalogService.remove(id).subscribe({
        next: () => {
          this.loadCatalogs();
        },
        error: (error) => {
          console.error('Error eliminando catálogo:', error);
        }
      });
    }
  }

  configurePermissions(id: string) {
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'ConfigurarPermisos')) {
      // Implementar configuración de permisos
      console.log('Configurando permisos para catálogo:', id);
    }
  }

  enableCatalog(id: string) {
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'Habilitar')) {
      // Implementar habilitación
      console.log('Habilitando catálogo:', id);
    }
  }

  disableCatalog(id: string) {
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'Deshabilitar')) {
      // Implementar deshabilitación
      console.log('Deshabilitando catálogo:', id);
    }
  }

  downloadCatalog(id: string) {
    if (this.permissionChecker.hasPermission(this.modulePermissions, 'descargar')) {
      // Implementar descarga
      console.log('Descargando catálogo:', id);
    }
  }

  // Event handlers - Remove onPageSizeChanged since search-filter-bar doesn't emit it
  onSearchChanged(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filterCatalogs();
  }

  onViewModeChanged(viewMode: ViewMode) {
    this.currentView = viewMode;
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }

  private filterCatalogs() {
    if (!this.searchTerm) {
      this.filteredCatalogs = [...this.catalogs];
    } else {
      this.filteredCatalogs = this.catalogs.filter(catalog =>
        catalog.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        catalog.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getPaginatedCatalogs(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredCatalogs.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredCatalogs.length / this.pageSize);
  }

  // Grid helper methods
  getCatalogGridItems(): GridItem[] {
    return this.getPaginatedCatalogs().map(catalog => ({
      id: catalog.id,
      name: catalog.nombre,
      description: catalog.descripcion
    }));
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
