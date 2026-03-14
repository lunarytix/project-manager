import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PermissionService } from './permission.service';
import { ModuleService } from './module.service';

export interface DynamicPermissions {
  canCreate: boolean;
  canUpdate: boolean; 
  canDelete: boolean;
  canRead: boolean;
  moduleName?: string;
  moduleId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicPermissionsService {
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);
  private moduleService = inject(ModuleService);
  private router = inject(Router);

  private currentPermissions = new BehaviorSubject<DynamicPermissions>({
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canRead: false
  });

  public permissions$ = this.currentPermissions.asObservable();

  constructor() {
    // Auto-update permissions when route changes or auth state changes
    combineLatest([
      this.router.events.pipe(startWith(null)),
      this.authService.authState$
    ]).subscribe(() => {
      this.updatePermissionsForCurrentRoute();
    });
  }

  /**
   * Get permissions for current route automatically
   */
  getCurrentPermissions(): Observable<DynamicPermissions> {
    return this.permissions$;
  }

  /**
   * Get permissions for a specific module route
   */
  getPermissionsForRoute(route: string): Observable<DynamicPermissions> {
    const user = this.authService.getCurrentUser();
    if (!user || !user.roleId) {
      return new BehaviorSubject<DynamicPermissions>({
        canCreate: false,
        canUpdate: false, 
        canDelete: false,
        canRead: false
      }).asObservable();
    }

    // Convert route to module ruta format (e.g., '/users' -> '/users')
    const moduleRuta = this.routeToModuleRuta(route);
    
    return this.moduleService.getAll().pipe(
      switchMap(modules => {
        const module = modules.find(m => m.ruta === moduleRuta);
        if (!module) {
          return new BehaviorSubject<DynamicPermissions>({
            canCreate: false,
            canUpdate: false,
            canDelete: false, 
            canRead: false
          }).asObservable();
        }

        return this.permissionService.getByRole(user.roleId).pipe(
          map(permissions => {
            const modulePermission = permissions.find(p => p.module && p.module.id === module.id);
            return {
              canCreate: !!modulePermission?.canCreate,
              canUpdate: !!modulePermission?.canUpdate,
              canDelete: !!modulePermission?.canDelete,
              canRead: !!modulePermission?.canRead,
              moduleName: module.nombre,
              moduleId: module.id
            };
          }),
          catchError(() => new BehaviorSubject<DynamicPermissions>({
            canCreate: false,
            canUpdate: false,
            canDelete: false,
            canRead: false
          }).asObservable())
        );
      })
    );
  }

  private updatePermissionsForCurrentRoute(): void {
    const currentUrl = this.router.url;
    const route = this.extractRouteFromUrl(currentUrl);
    
    this.getPermissionsForRoute(route).subscribe(permissions => {
      this.currentPermissions.next(permissions);
    });
  }

  private extractRouteFromUrl(url: string): string {
    // Extract main route from URL
    // e.g., '/users/create' -> '/users'
    // e.g., '/permission-catalogs/edit/123' -> '/permission-catalogs'
    const segments = url.split('/').filter(Boolean);
    return segments.length > 0 ? `/${segments[0]}` : '/';
  }

  private routeToModuleRuta(route: string): string {
    // Convert Angular route to backend module ruta
    // This handles special mappings if needed
    const mappings: { [key: string]: string } = {
      '/permission-catalogs': '/permission-catalogs', 
      '/users': '/users',
      '/roles': '/roles',
      '/permissions': '/permissions',
      '/modules': '/modules',
      '/appearance': '/appearance'
    };
    
    return mappings[route] || route;
  }
}