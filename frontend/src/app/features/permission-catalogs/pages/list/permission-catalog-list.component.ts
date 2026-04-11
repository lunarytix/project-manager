import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionCatalogService } from '../../../../core/services/permission-catalog.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BaseDynamicPermissionsComponent } from '../../../../core/components/base-dynamic-permissions.component';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';
import { SearchFilterBarComponent, SearchFilterConfig } from '../../../../shared/components/search-filter-bar/search-filter-bar.component';
import { ActionDropdownComponent, ActionItem, ActionDropdownConfig } from '../../../../shared/components/action-dropdown/action-dropdown.component';
import { ViewMode } from '../../../../shared/components/view-toggle/view-toggle.component';
import { StandardGridComponent, GridConfig, GridItem } from '../../../../shared/components/standard-grid/standard-grid.component';

@Component({
  selector: 'app-permission-catalog-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, GenericTableComponent, SearchFilterBarComponent, StandardGridComponent],
  templateUrl: './permission-catalog-list.component.html',
  styleUrls: ['./permission-catalog-list.component.scss']
})
export class PermissionCatalogListComponent extends BaseDynamicPermissionsComponent {
  catalogs: any[] = [];
  loading = false;

  // Search and Pagination
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  currentView: ViewMode = 'table';

  // Configurations
  searchFilterConfig: SearchFilterConfig = {
    placeholder: 'Buscar catálogos...',
    showCreateButton: true,
    createButtonText: 'Crear Catálogo',
    createButtonIcon: 'add_box',
    showViewToggle: true,
    showPagination: true,
    pageSize: this.pageSize
  };

  actionDropdownConfig: ActionDropdownConfig = {
    buttonIcon: 'more_vert',
    buttonVariant: 'outline',
    position: 'bottom-right'
  };

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'id', label: 'ID' }
  ];

  // Legacy columns for compatibility
  cols: TableColumn[] = this.tableColumns;

  // Grid configuration
  gridConfig: GridConfig = {
    cardHeaderClass: 'catalog-header',
    gridColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  };

  constructor(private svc: PermissionCatalogService) {
    super();
  }

  protected onComponentInit(): void {
    this.load();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: c => {
        this.catalogs = c;
        this.loading = false;
        this.updateSearchConfig();
      },
      error: () => this.loading = false
    });
  }

  edit(id?: string) {
    if (!id) {
      this.navigateToCreate('/permission-catalogs');
    } else {
      this.navigateToEdit(id, '/permission-catalogs');
    }
  }

  remove(id: string | undefined) {
    if (!id) return;
    if (!confirm('Eliminar catálogo?')) return;
    this.svc.remove(id).subscribe({
      next: () => this.load()
    });
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
    this.edit();
  }

  // Filtered and paginated data
  get filteredCatalogs(): any[] {
    if (!this.searchTerm) return this.catalogs;

    const term = this.searchTerm.toLowerCase();
    return this.catalogs.filter(catalog =>
      catalog.nombre.toLowerCase().includes(term) ||
      (catalog.descripcion && catalog.descripcion.toLowerCase().includes(term))
    );
  }

  get paginatedCatalogs(): any[] {
    const filtered = this.filteredCatalogs;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCatalogs.length / this.pageSize));
  }

  get tableData(): any[] {
    return this.filteredCatalogs;
  }

  // Update search config when data changes
  updateSearchConfig(): void {
    this.searchFilterConfig = {
      ...this.searchFilterConfig,
      totalItems: this.filteredCatalogs.length
    };
  }

  // Grid methods
  get gridItems(): GridItem[] {
    return this.paginatedCatalogs.map(catalog => ({
      id: catalog.id.toString(),
      name: catalog.nombre,
      description: catalog.descripcion || 'Sin descripción',
      status: true, // Catalogs don't have status in the data structure, assume active
      statusText: 'Activo',
      createdAt: new Date(catalog.createdAt || Date.now()),
      icon: 'category'
    }));
  }

  getCatalogActionsForGrid = (catalog: any): ActionItem[] => {
    const originalCatalog = this.catalogs.find(c => c.id.toString() === catalog.id);
    return this.getCatalogActions(originalCatalog || catalog);
  };

  onGridEdit(item: GridItem): void {
    this.edit(item.id);
  }

  onGridAction(event: { action: ActionItem; item: GridItem }): void {
    const catalog = this.catalogs.find(c => c.id.toString() === event.item.id);
    if (catalog) {
      this.onCatalogAction(event.action, catalog);
    }
  }

  // Generate actions for each catalog
  getCatalogActions(catalog: any): ActionItem[] {
    return [
      {
        key: 'edit',
        label: 'Editar Catálogo',
        icon: 'edit',
        color: 'primary',
        disabled: !this.permissions.canUpdate
      },
      {
        key: 'separator',
        label: '',
        separator: true
      },
      {
        key: 'delete',
        label: 'Eliminar Catálogo',
        icon: 'delete',
        color: 'danger',
        disabled: !this.permissions.canDelete
      }
    ];
  }

  // Handle action clicks
  onCatalogAction(action: ActionItem, catalog: any): void {
    switch (action.key) {
      case 'edit':
        this.edit(catalog.id);
        break;
      case 'delete':
        this.remove(catalog.id);
        break;
    }
  }

  // Track by function for ngFor optimization
  trackByCatalogId(index: number, catalog: any): string {
    return catalog.id || index.toString();
  }
}
