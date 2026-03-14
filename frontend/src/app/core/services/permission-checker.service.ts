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
  checkModulePermissions(userPermissions: any[], moduleName: string): DynamicModulePermissions {
    const modulePermissions = userPermissions?.filter(p =>
      p.module?.nombre?.toLowerCase() === moduleName.toLowerCase() ||
      p.module?.ruta?.includes(moduleName.toLowerCase())
    ) || [];

    const permissions: DynamicModulePermissions = {};

    // Agregar todos los catálogos de permisos encontrados
    modulePermissions.forEach(p => {
      if (p.permissionCatalog?.nombre) {
        permissions[p.permissionCatalog.nombre] = p.isGranted;
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
