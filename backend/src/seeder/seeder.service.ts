import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { ModuleEntity } from '../modules/module.entity';
import { PermissionEntity } from '../permissions/permission.entity';
import { PermissionCatalogEntity } from '../permission-catalogs/permission-catalog.entity';
import { AppearanceEntity } from '../appearance/appearance.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    console.log('🚀 SEEDER: Starting database seeding...');
    const roleRepository = this.dataSource.getRepository(RoleEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);
    const moduleRepository = this.dataSource.getRepository(ModuleEntity);
    const permissionRepository = this.dataSource.getRepository(PermissionEntity);
    const catalogRepository = this.dataSource.getRepository(PermissionCatalogEntity);
    const appearanceRepository = this.dataSource.getRepository(AppearanceEntity);

    // Create default roles
    const adminRole = await roleRepository.findOne({ where: { nombre: 'admin' } });
    if (!adminRole) {
      await roleRepository.save({
        nombre: 'admin',
        descripcion: 'Administrador del sistema',
        activo: true
      });
      console.log('✓ Role created: admin');
    }

    const colaboradorRole = await roleRepository.findOne({ where: { nombre: 'colaborador' } });
    if (!colaboradorRole) {
      await roleRepository.save({
        nombre: 'colaborador',
        descripcion: 'Usuario colaborador',
        activo: true
      });
      console.log('✓ Role created: colaborador');
    }

    // Create default modules
    const dashboardModule = await moduleRepository.findOne({ where: { nombre: 'Dashboard' } });
    if (!dashboardModule) {
      await moduleRepository.save({
        nombre: 'Dashboard',
        descripcion: 'Panel de control',
        ruta: '/dashboard',
        icono: 'dashboard',
        activo: true
      });
      console.log('✓ Module created: Dashboard');
    }

    const usuariosModule = await moduleRepository.findOne({ where: { nombre: 'Usuarios' } });
    if (!usuariosModule) {
      await moduleRepository.save({
        nombre: 'Usuarios',
        descripcion: 'Gestión de usuarios',
        ruta: '/users',
        icono: 'people',
        activo: true
      });
      console.log('✓ Module created: Usuarios');
    }

    const modulosModule = await moduleRepository.findOne({ where: { nombre: 'Módulos' } });
    if (!modulosModule) {
      await moduleRepository.save({
        nombre: 'Módulos',
        descripcion: 'Gestión de módulos',
        ruta: '/modules',
        icono: 'apps',
        activo: true
      });
      console.log('✓ Module created: Módulos');
    }

    const rolesModule = await moduleRepository.findOne({ where: { nombre: 'Roles' } });
    if (!rolesModule) {
      await moduleRepository.save({
        nombre: 'Roles',
        descripcion: 'Gestión de roles',
        ruta: '/roles',
        icono: 'security',
        activo: true
      });
      console.log('✓ Module created: Roles');
    }

    // Add Permission Catalogs module so it appears on dashboard navigation
    const catalogsModule = await moduleRepository.findOne({ where: { nombre: 'Catálogos' } });
    if (!catalogsModule) {
      await moduleRepository.save({
        nombre: 'Catálogos',
        descripcion: 'Catálogos de permisos',
        ruta: '/permission-catalogs',
        icono: 'book',
        activo: true
      });
      console.log('✓ Module created: Catálogos');
    }

    // Add CatalogoPermisos module for dynamic permission system
    const catalogoPermisosModule = await moduleRepository.findOne({ where: { nombre: 'CatalogoPermisos' } });
    if (!catalogoPermisosModule) {
      await moduleRepository.save({
        nombre: 'CatalogoPermisos',
        descripcion: 'Gestión de catálogos de permisos',
        ruta: '/permission-catalogs',
        icono: 'security',
        activo: true
      });
      console.log('✓ Module created: CatalogoPermisos');
    }

    // Add Appearance module
    const appearanceModule = await moduleRepository.findOne({ where: { nombre: 'Apariencia' } });
    if (!appearanceModule) {
      await moduleRepository.save({
        nombre: 'Apariencia',
        descripcion: 'Gestión de temas y colores',
        ruta: '/appearance',
        icono: 'palette',
        activo: true
      });
      console.log('✓ Module created: Apariencia');
    }

    const auditModule = await moduleRepository.findOne({ where: { nombre: 'Auditoría' } });
    if (!auditModule) {
      await moduleRepository.save({
        nombre: 'Auditoría',
        descripcion: 'Logs de movimientos y modo debug',
        ruta: '/audit',
        icono: 'bug_report',
        activo: true
      });
      console.log('✓ Module created: Auditoría');
    }

    const projectControlModule = await moduleRepository.findOne({ where: { nombre: 'ProyectosSoftware' } });
    if (!projectControlModule) {
      await moduleRepository.save({
        nombre: 'ProyectosSoftware',
        descripcion: 'Control de proyectos de software (git, deploy, db)',
        ruta: '/project-control',
        icono: 'terminal',
        activo: true
      });
      console.log('✓ Module created: ProyectosSoftware');
    }

    // Create default appearance theme
    const defaultTheme = await appearanceRepository.findOne({ where: { name: 'Tema Azul Clásico' } });
    if (!defaultTheme) {
      await appearanceRepository.save({
        name: 'Tema Azul Clásico',
        description: 'Tema por defecto con colores azul corporativo',
        primaryColor: '#3B82F6',
        primaryDarkColor: '#1E3A8A',
        primaryLightColor: '#BFDBFE',
        secondaryColor: '#10B981',
        secondaryDarkColor: '#064E3B',
        secondaryLightColor: '#BBF7D0',
        tertiaryColor: '#F59E0B',
        tertiaryDarkColor: '#92400E',
        tertiaryLightColor: '#FEF3C7',
        backgroundColor: '#FFFFFF',
        backgroundSecondaryColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        textPrimaryColor: '#111827',
        textSecondaryColor: '#6B7280',
        textMutedColor: '#9CA3AF',
        dangerColor: '#EF4444',
        successColor: '#22C55E',
        warningColor: '#F59E0B',
        infoColor: '#3B82F6',
        // Typography
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        fontSizeSmall: '14px',
        fontSizeLarge: '18px',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0px',
        // Visual effects
        textShadow: 'none',
        borderRadius: '8px',
        borderRadiusSmall: '4px',
        borderRadiusLarge: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        backdropBlur: '0px',
        backgroundOpacity: '1',
        glassEffect: false,
        // Input styles
        inputBackgroundColor: '#FFFFFF',
        inputBorderColor: '#E2E8F0',
        inputFocusColor: '#3B82F6',
        inputPadding: '12px 16px',
        isActive: true,
        isDefault: true
      });
      console.log('✓ Default theme created: Tema Azul Clásico');
    }

    // Create Glass Liquid theme
    const glassTheme = await appearanceRepository.findOne({ where: { name: 'Glass Liquid' } });
    if (!glassTheme) {
      await appearanceRepository.save({
        name: 'Glass Liquid',
        description: 'Tema moderno con efectos de vidrio translucido y bordes suaves',
        primaryColor: '#667eea',
        primaryDarkColor: '#764ba2',
        primaryLightColor: '#a8e6cf',
        secondaryColor: '#f093fb',
        secondaryDarkColor: '#f25cfe',
        secondaryLightColor: '#ffc3a0',
        tertiaryColor: '#4facfe',
        tertiaryDarkColor: '#00f2fe',
        tertiaryLightColor: '#43e97b',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backgroundSecondaryColor: 'rgba(248, 250, 252, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.18)',
        textPrimaryColor: '#1a202c',
        textSecondaryColor: '#4a5568',
        textMutedColor: '#718096',
        dangerColor: '#f56565',
        successColor: '#48bb78',
        warningColor: '#ed8936',
        infoColor: '#4299e1',
        // Typography
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        fontSizeSmall: '14px',
        fontSizeLarge: '18px',
        fontWeight: '400',
        lineHeight: '1.6',
        letterSpacing: '0.2px',
        // Visual effects
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        borderRadius: '16px',
        borderRadiusSmall: '8px',
        borderRadiusLarge: '24px',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        backdropBlur: '12px',
        backgroundOpacity: '0.85',
        glassEffect: true,
        // Input styles
        inputBackgroundColor: 'rgba(255, 255, 255, 0.25)',
        inputBorderColor: 'rgba(255, 255, 255, 0.18)',
        inputFocusColor: '#667eea',
        inputPadding: '14px 18px',
        isActive: true,
        isDefault: false
      });
      console.log('✓ Glass Liquid theme created');
    }

    // Create seed user (ensure roleId references actual role id)
    const existingUser = await userRepository.findOne({ where: { email: 'admin@test.com' } });
    const adminRoleRef = await roleRepository.findOne({ where: { nombre: 'admin' } });
    if (!existingUser) {
      await userRepository.save({
        nombre: 'Admin',
        email: 'admin@test.com',
        password: 'admin123',
        roleId: adminRoleRef ? adminRoleRef.id : 'admin',
        activo: true
      });
      console.log('✓ Seed user created: admin@test.com / admin123');
    } else {
      // if existing user has roleId as role name, update to actual role id
      if (adminRoleRef && existingUser.roleId !== adminRoleRef.id) {
        existingUser.roleId = adminRoleRef.id;
        await userRepository.save(existingUser);
        console.log('✓ Seed user roleId corrected to role id');
      }
    }

    // Create default permission catalogs first
    const defaultCatalogs = [
      { nombre: 'Vista', descripcion: 'Permiso para ver el módulo en dashboard', icono: 'visibility' },
      { nombre: 'Leer', descripcion: 'Permiso de lectura', icono: 'visibility' },
      { nombre: 'Crear', descripcion: 'Permiso de creación', icono: 'add' },
      { nombre: 'Editar', descripcion: 'Permiso de edición', icono: 'edit' },
      { nombre: 'Eliminar', descripcion: 'Permiso de eliminación', icono: 'delete' },
      { nombre: 'descargar', descripcion: 'Permiso de descarga', icono: 'download' },
      { nombre: 'ConfigurarPermisos', descripcion: 'Permiso para configurar permisos', icono: 'security' },
      { nombre: 'Habilitar', descripcion: 'Permiso para habilitar/activar', icono: 'check_circle' },
      { nombre: 'Deshabilitar', descripcion: 'Permiso para deshabilitar/desactivar', icono: 'cancel' },
      { nombre: 'VerDetalles', descripcion: 'Permiso para ver detalles', icono: 'info' }
    ];

    const savedCatalogs: PermissionCatalogEntity[] = [];
    for (const c of defaultCatalogs) {
      let cat = await catalogRepository.findOne({ where: { nombre: c.nombre } });
      if (!cat) {
        cat = await catalogRepository.save(c as any);
        console.log(`✓ Catalog created: ${c.nombre}`);
      } else if (!cat.icono && c.icono) {
        cat.icono = c.icono;
        await catalogRepository.save(cat);
        console.log(`✓ Catalog updated (icono added): ${c.nombre}`);
      }
      if (cat) {
        savedCatalogs.push(cat);
      }
    }

    // Create permissions: give admin access to all modules with all catalogs
    // First, clear old permissions to avoid conflicts with new system
    console.log('🧹 Clearing old permissions...');
    await permissionRepository.clear();

    const admin = await roleRepository.findOne({ where: { nombre: 'admin' } });
    if (admin) {
      const modules = await moduleRepository.find();

      for (const mod of modules) {
        for (const catalog of savedCatalogs) {
          const exists = await permissionRepository.findOne({
            where: {
              role: { id: admin.id },
              module: { id: mod.id },
              permissionCatalog: { id: catalog.id }
            } as any
          });

          if (!exists) {
            await permissionRepository.save({
              role: admin,
              module: mod,
              permissionCatalog: catalog,
              isGranted: true
            });
            console.log(`✓ Permission created: admin -> ${mod.nombre} -> ${catalog.nombre}`);
          }
        }
      }
    }

    // Create some permissions for colaborador role too (limited access)
    const colaborador = await roleRepository.findOne({ where: { nombre: 'colaborador' } });
    if (colaborador) {
      const modules = await moduleRepository.find();
      const limitedCatalogs = savedCatalogs.filter(c =>
        ['Vista', 'Leer', 'VerDetalles'].includes(c.nombre)
      );

      if (limitedCatalogs.length > 0) {
        for (const mod of modules) {
          if (mod.ruta === '/audit') continue;

          for (const catalog of limitedCatalogs) {
            const exists = await permissionRepository.findOne({
              where: {
                role: { id: colaborador.id },
                module: { id: mod.id },
                permissionCatalog: { id: catalog.id }
              } as any
            });

            if (!exists) {
              await permissionRepository.save({
                role: colaborador,
                module: mod,
                permissionCatalog: catalog,
                isGranted: true
              });
              console.log(`✓ Permission created: colaborador -> ${mod.nombre} -> ${catalog.nombre}`);
            }
          }
        }
      }
    }

    console.log('✅ SEEDER: Database seeding completed successfully!');
  }
}
