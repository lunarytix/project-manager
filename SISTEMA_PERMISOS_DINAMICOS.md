# Sistema de Permisos Dinámicos - Permission Module

## Descripción General

Este sistema implementa un control de permisos completamente dinámico y basado en catálogo para la aplicación. Todos los permisos se definen en la base de datos y se aplican dinámicamente en el frontend.

## Estructura del Sistema

### Backend

#### Entidades
- **RoleEntity**: Define los roles del sistema (admin, colaborador, etc.)
- **ModuleEntity**: Define los módulos de la aplicación
- **PermissionCatalogEntity**: Define los tipos de permisos disponibles
- **PermissionEntity**: Relaciona roles + módulos + catálogos de permisos

#### Catálogo de Permisos (10 tipos)
1. **Vista** - Ver listado del módulo
2. **Leer** - Leer contenido detallado
3. **Crear** - Crear nuevos registros
4. **Editar** - Modificar registros existentes
5. **Eliminar** - Eliminar registros
6. **descargar** - Descargar/exportar datos
7. **ConfigurarPermisos** - Configurar permisos específicos
8. **Habilitar** - Habilitar/activar registros
9. **Deshabilitar** - Deshabilitar/desactivar registros
10. **VerDetalles** - Ver detalles específicos de registros

### Frontend

#### Interfaces
```typescript
interface DynamicModulePermissions {
  moduleName: string;
  permissions: {
    [permissionName: string]: boolean;
  };
  hasAnyPermission: boolean;
}
```

#### PermissionCheckerService
Servicio principal que maneja toda la lógica de permisos:

```typescript
// Verificar permisos específicos
hasPermission(modulePermissions: DynamicModulePermissions, action: string): boolean

// Obtener acciones disponibles
getAvailableActions(modulePermissions: DynamicModulePermissions): string[]

// Obtener acciones extra para tablas
getTableExtraActions(modulePermissions: DynamicModulePermissions): ActionItem[]

// Verificar permisos de módulo
checkModulePermissions(moduleName: string): DynamicModulePermissions
```

## Rol de Permisos

### Administrador (admin)
- **Acceso total**: Todos los 10 tipos de permisos en todos los módulos
- Se asigna automáticamente en el seeder

### Colaborador (colaborador)  
- **Acceso limitado**: Solo Vista, Leer, VerDetalles
- Para módulos según configuración

## Implementación en Componentes

### Estructura Recomendada

```typescript
export class ComponentContainerComponent implements OnInit {
  modulePermissions!: DynamicModulePermissions;

  constructor(public permissionChecker: PermissionCheckerService) {}

  ngOnInit() {
    this.modulePermissions = this.permissionChecker.checkModulePermissions('NombreModulo');
  }

  // Acciones basadas en permisos
  getRecordActions(record: any): ActionItem[] {
    return this.permissionChecker.getAvailableActions(this.modulePermissions).map(action => {
      // Mapear acciones específicas del componente
    });
  }
}
```

### Template HTML

```html
<!-- Verificar permiso de vista -->
<div *ngIf="permissionChecker.hasPermission(modulePermissions, 'Vista')">
  <!-- Contenido del componente -->
</div>

<!-- Botón condicional -->
<button 
  *ngIf="permissionChecker.hasPermission(modulePermissions, 'Crear')" 
  (click)="create()">
  Crear
</button>

<!-- Mensaje de acceso denegado -->
<div *ngIf="!permissionChecker.hasPermission(modulePermissions, 'Vista')">
  <mat-icon>lock</mat-icon>
  <h3>Acceso Denegado</h3>
  <p>No tiene permisos para ver este módulo.</p>
</div>
```

## Módulos Implementados

### ✅ Completados
1. **Usuarios** - `/users`
   - Container: `usuario-container.component`
   - Módulo: `Usuarios`
   - Todas las acciones dinámicas implementadas

2. **Roles** - `/roles`
   - Container: `roles-container.component`  
   - Módulo: `Roles`
   - Sistema de permisos completamente dinámico

3. **Catálogos de Permisos** - `/permission-catalogs`
   - Container: `permission-catalog-container.component`
   - Módulo: `CatalogoPermisos`
   - **NUEVO**: Sistema completo con 10 acciones

### 🔄 Pendientes
1. **Módulos** - `/modules`
2. **Apariencia** - `/appearance`  
3. **Dashboard** - Navegación basada en permisos

## Configuración del Seeder

### Módulos en Base de Datos
```typescript
// Módulos que se crean automáticamente
const modules = [
  'Dashboard',
  'Usuarios', 
  'Módulos',
  'Roles',
  'Catálogos',
  'CatalogoPermisos', // Para sistema dinámico
  'Apariencia'
];
```

### Permisos por Defecto
- **Admin**: Todos los permisos en todos los módulos (10 x módulos)
- **Colaborador**: Vista, Leer, VerDetalles en todos los módulos (3 x módulos)

## Ventajas del Sistema Dinámico

1. **Flexibilidad Total**: Los permisos se definen en BD, no en código
2. **Escalabilidad**: Fácil agregar nuevos tipos de permisos
3. **Mantenibilidad**: Un solo servicio maneja toda la lógica
4. **Consistencia**: Mismo patrón en todos los componentes
5. **Granularidad**: Control específico por módulo y acción

## Flujo de Trabajo para Nuevos Módulos

1. **Agregar módulo al seeder** con nombre específico
2. **Crear container component** que use `PermissionCheckerService`
3. **Implementar verificaciones** con `hasPermission()`
4. **Mapear acciones dinámicas** con `getAvailableActions()`
5. **Configurar templates** con directivas `*ngIf`

## Debugging y Logs

El `PermissionCheckerService` incluye logs detallados:
```typescript
console.log('📋 Checking permissions for module:', moduleName);
console.log('🔐 Available actions:', availableActions);
console.log('⚠️ No permissions found for module:', moduleName);
```

## Próximos Pasos

1. **Completar módulos pendientes** (Módulos, Apariencia)
2. **Implementar dashboard dinámico** basado en permisos
3. **Validar sistema completo** con diferentes roles
4. **Documentar patrones específicos** para casos avanzados
