import { Routes } from '@angular/router';

export const permissionCatalogsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/permission-catalog-container/permission-catalog-container.component').then(m => m.PermissionCatalogContainerComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/edit/permission-catalog-edit.component').then(m => m.PermissionCatalogEditComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/edit/permission-catalog-edit.component').then(m => m.PermissionCatalogEditComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./pages/list/permission-catalog-list.component').then(m => m.PermissionCatalogListComponent)
  }
];
