import { Injectable } from '@angular/core';

export interface DynamicModulePermissions {
  [catalogName: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionCheckerService {

  /**
   * Verifica los permisos de un usuario para un módulo específico de forma dinámica
   * @param userPermissions - Array de permisos del usuario
   * @param moduleName - Nombre del módulo a verificar
   * @returns Objeto con los permisos disponibles dinámicamente
   */
  /**
   * Remove diacritical marks (accents) from a string for comparison.
   * e.g. 'Módulos' → 'Modulos', 'Catálogos' → 'Catalogos'
   */
  private stripAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  checkModulePermissions(userPermissions: any[], moduleName: string): DynamicModulePermissions {
    const permissions: DynamicModulePermissions = {};
    if (!userPermissions || !Array.isArray(userPermissions)) return permissions;

    const moduleNameLower = this.stripAccents((moduleName || '').toString()).toLowerCase();

    userPermissions.forEach(p => {
      // Normalize module identification fields coming from different backends
      const moduleNombre = this.stripAccents((p?.module?.nombre ?? p?.module ?? '').toString()).toLowerCase();
      const moduleRuta = this.stripAccents((p?.module?.ruta ?? p?.module?.route ?? '').toString()).toLowerCase();

      const matchesModule = (
        moduleNombre && moduleNombre.includes(moduleNameLower)
      ) || (
        moduleRuta && moduleRuta.includes(moduleNameLower)
      ) || (
        moduleNameLower && moduleNameLower.includes(moduleNombre)
      );

      if (!matchesModule) return;

      // Different backends may return permission catalog objects or boolean flags
      if (p.permissionCatalog && p.permissionCatalog.nombre) {
        permissions[p.permissionCatalog.nombre] = !!p.isGranted;
        return;
      }

      // Legacy boolean flags mapping
      if (typeof p.canCreate === 'boolean') permissions['Crear'] = permissions['Crear'] || !!p.canCreate;
      if (typeof p.canUpdate === 'boolean') permissions['Editar'] = permissions['Editar'] || !!p.canUpdate;
      if (typeof p.canDelete === 'boolean') permissions['Eliminar'] = permissions['Eliminar'] || !!p.canDelete;
      if (typeof p.canRead === 'boolean') permissions['Leer'] = permissions['Leer'] || !!p.canRead;
      if (typeof p.canEnable === 'boolean') permissions['Habilitar'] = permissions['Habilitar'] || !!p.canEnable;
      if (typeof p.canDisable === 'boolean') permissions['Deshabilitar'] = permissions['Deshabilitar'] || !!p.canDisable;

      // Some backends may provide a permissions array or object
      if (p.permissions && Array.isArray(p.permissions)) {
        p.permissions.forEach((perm: any) => {
          const name = (perm?.name ?? perm?.nombre ?? '').toString();
          if (name) permissions[name] = permissions[name] || !!perm?.granted || !!perm?.isGranted || !!perm?.value;
        });
      }

      // Generic single permission field
      if (p.permission && (p.permission.nombre || p.permission.name)) {
        const name = (p.permission.nombre ?? p.permission.name).toString();
        permissions[name] = permissions[name] || !!p.isGranted || !!p.permission?.isGranted || !!p.permission?.granted;
      }
    });

    return permissions;
  }

  /**
   * Verifica si el usuario tiene un catálogo de permiso específico
   * @param permissions - Objeto de permisos del módulo
   * @param catalogName - Nombre del catálogo a verificar
   * @returns boolean
   */
  hasPermission(permissions: DynamicModulePermissions, catalogName: string): boolean {
    if (!permissions) return false;
    return permissions[catalogName] === true;
  }

  /**
   * Filtra módulos visibles basado en permisos de Vista
   * @param modules - Array de módulos
   * @param userPermissions - Permisos del usuario
   * @returns Módulos que el usuario puede ver
   */
  filterVisibleModules(modules: any[], userPermissions: any[]): any[] {
    return modules.filter(module => {
      const permissions = this.checkModulePermissions(userPermissions, module.nombre);
      return this.hasPermission(permissions, 'Vista');
    });
  }

  /**
   * Obtiene acciones disponibles basadas en permisos reales
   * @param permissions - Permisos del módulo
   * @returns Array de acciones permitidas con sus detalles
   */
  getAvailableActions(permissions: DynamicModulePermissions): any[] {
    const actions: any[] = [];

    // Mapear permisos a acciones
    const actionMap = {
      'Crear': { key: 'create', label: 'Crear', icon: 'add', color: 'primary' },
      'Editar': { key: 'edit', label: 'Editar', icon: 'edit', color: 'primary' },
      'Eliminar': { key: 'delete', label: 'Eliminar', icon: 'delete', color: 'danger' },
      'ConfigurarPermisos': { key: 'permissions', label: 'Configurar Permisos', icon: 'security', color: 'secondary' },
      'Habilitar': { key: 'enable', label: 'Habilitar', icon: 'check_circle', color: 'success' },
      'Deshabilitar': { key: 'disable', label: 'Deshabilitar', icon: 'cancel', color: 'warning' },
      'VerDetalles': { key: 'details', label: 'Ver Detalles', icon: 'info', color: 'info' },
      'descargar': { key: 'download', label: 'Descargar', icon: 'download', color: 'success' }
    };

    // Agregar acciones según permisos disponibles
    Object.keys(permissions).forEach(catalogName => {
      if (permissions[catalogName] && actionMap[catalogName as keyof typeof actionMap]) {
        actions.push(actionMap[catalogName as keyof typeof actionMap]);
      }
    });

    return actions;
  }

  /**
   * Obtiene acciones extra para tabla genérica basadas en permisos reales
   * @param permissions - Permisos del módulo
   * @returns Array de acciones extra para tabla
   */
  getTableExtraActions(permissions: DynamicModulePermissions): any[] {
    const actions: any[] = [];

    if (this.hasPermission(permissions, 'ConfigurarPermisos')) {
      actions.push({ key: 'permissions', label: 'Configurar Permisos', icon: 'security' });
    }

    if (this.hasPermission(permissions, 'VerDetalles')) {
      actions.push({ key: 'details', label: 'Ver Detalles', icon: 'info' });
    }

    if (this.hasPermission(permissions, 'Habilitar') || this.hasPermission(permissions, 'Deshabilitar')) {
      actions.push({ key: 'toggle-status', label: 'Cambiar Estado', icon: 'visibility' });
    }

    if (this.hasPermission(permissions, 'descargar')) {
      actions.push({ key: 'download', label: 'Descargar', icon: 'download' });
    }

    return actions;
  }

  /**
   * Método de compatibilidad hacia atrás - mapea permisos dinámicos a interfaz legacy
   */
  mapToLegacyPermissions(permissions: DynamicModulePermissions) {
    return {
      canView: this.hasPermission(permissions, 'Vista'),
      canRead: this.hasPermission(permissions, 'Leer'),
      canCreate: this.hasPermission(permissions, 'Crear'),
      canEdit: this.hasPermission(permissions, 'Editar'),
      canDelete: this.hasPermission(permissions, 'Eliminar'),
      canDownload: this.hasPermission(permissions, 'descargar'),
      canConfigurePermissions: this.hasPermission(permissions, 'ConfigurarPermisos'),
      canEnable: this.hasPermission(permissions, 'Habilitar'),
      canDisable: this.hasPermission(permissions, 'Deshabilitar'),
      canViewDetails: this.hasPermission(permissions, 'VerDetalles')
    };
  }
}
