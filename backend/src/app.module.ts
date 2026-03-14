import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards/permission.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesModule } from './modules/modules.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionCatalogsModule } from './permission-catalogs/permission-catalogs.module';
import { UsersModule } from './users/users.module';
import { AppearanceModule } from './appearance/appearance.module';
import { SeederService } from './seeder/seeder.service';
import { DataSource } from 'typeorm';

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
    AppearanceModule
  ],
  providers: [
    SeederService,
    { provide: APP_GUARD, useClass: PermissionGuard }
  ]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

