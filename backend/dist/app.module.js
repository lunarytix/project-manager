"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permission_guard_1 = require("./guards/permission.guard");
const typeorm_1 = require("@nestjs/typeorm");
const modules_module_1 = require("./modules/modules.module");
const auth_module_1 = require("./auth/auth.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const permission_catalogs_module_1 = require("./permission-catalogs/permission-catalogs.module");
const users_module_1 = require("./users/users.module");
const appearance_module_1 = require("./appearance/appearance.module");
const seeder_service_1 = require("./seeder/seeder.service");
const typeorm_2 = require("typeorm");
let AppModule = class AppModule {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'data/sqlite.db',
                synchronize: true,
                logging: false,
                entities: [__dirname + '/**/*.entity{.ts,.js}']
            }),
            modules_module_1.ModulesModule,
            auth_module_1.AuthModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            permission_catalogs_module_1.PermissionCatalogsModule,
            users_module_1.UsersModule,
            appearance_module_1.AppearanceModule
        ],
        providers: [
            seeder_service_1.SeederService,
            { provide: core_1.APP_GUARD, useClass: permission_guard_1.PermissionGuard }
        ]
    }),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppModule);
