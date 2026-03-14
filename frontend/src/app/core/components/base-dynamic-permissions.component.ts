import { OnInit, OnDestroy, Directive, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicPermissionsService, DynamicPermissions } from '../services/dynamic-permissions.service';
import { Subscription } from 'rxjs';

@Directive()
export abstract class BaseDynamicPermissionsComponent implements OnInit, OnDestroy {
  protected dynamicPermissionsService = inject(DynamicPermissionsService);
  protected router = inject(Router);

  // Dynamic permissions available to all extending components
  permissions: DynamicPermissions = {
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canRead: false
  };

  private permissionsSubscription?: Subscription;

  ngOnInit(): void {
    this.loadPermissions();
    this.onComponentInit();
  }

  ngOnDestroy(): void {
    this.permissionsSubscription?.unsubscribe();
    this.onComponentDestroy();
  }

  private loadPermissions(): void {
    this.permissionsSubscription = this.dynamicPermissionsService
      .getCurrentPermissions()
      .subscribe(permissions => {
        this.permissions = permissions;
        this.onPermissionsLoaded(permissions);
      });
  }

  // Abstract methods for extending components to implement
  protected abstract onComponentInit(): void;
  protected onComponentDestroy(): void {}
  protected onPermissionsLoaded(permissions: DynamicPermissions): void {}

  // Common navigation methods
  protected navigateToCreate(basePath?: string): void {
    const path = basePath || this.getCurrentBasePath();
    this.router.navigate([`${path}/create`]);
  }

  protected navigateToEdit(id: string, basePath?: string): void {
    const path = basePath || this.getCurrentBasePath();
    this.router.navigate([`${path}/edit`, id]);
  }

  private getCurrentBasePath(): string {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/').filter(Boolean);
    return segments.length > 0 ? `/${segments[0]}` : '';
  }
}