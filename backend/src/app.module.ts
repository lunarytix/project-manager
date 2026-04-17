import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PermissionGuard } from './guards/permission.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesModule } from './modules/modules.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionCatalogsModule } from './permission-catalogs/permission-catalogs.module';
import { UsersModule } from './users/users.module';
import { AppearanceModule } from './appearance/appearance.module';
import { AuditModule } from './audit/audit.module';
import { ProjectControlModule } from './project-control/project-control.module';
import { SeederService } from './seeder/seeder.service';
import { DataSource } from 'typeorm';
import { AuditLogInterceptor } from './audit/interceptors/audit-log.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/sqlite.db',
      synchronize: true,
      logging: false,
      entities: [__dirname + '/**/*.entity{.ts,.js}']
    }),
    ModulesModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    PermissionCatalogsModule,
    UsersModule,
    AppearanceModule,
    AuditModule,
    ProjectControlModule
  ],
  providers: [
    SeederService,
    { provide: APP_GUARD, useClass: PermissionGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor }
  ]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

