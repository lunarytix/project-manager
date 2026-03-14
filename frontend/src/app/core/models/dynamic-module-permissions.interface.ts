export interface DynamicModulePermissions {
  moduleName: string;
  permissions: {
    [permissionName: string]: boolean;
  };
  hasAnyPermission: boolean;
}
