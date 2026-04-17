import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionCatalogsRoutes } from './features/permission-catalogs/permission-catalogs-routing.module';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'auth/login',
		pathMatch: 'full'
	},
	{
		path: 'auth',
		loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
		canActivate: [authGuard]
	},
	{
		path: 'users',
		loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
		canActivate: [authGuard]
	},
	{
		path: 'modules',
		loadChildren: () => import('./features/modules/modules.module').then(m => m.ModulesModule),
		canActivate: [authGuard]
	},
	{
		path: 'roles',
		loadChildren: () => import('./features/roles/roles.module').then(m => m.RolesModule),
		canActivate: [authGuard]
	},
	{
		path: 'permission-catalogs',
		children: permissionCatalogsRoutes,
		canActivate: [authGuard]
	},
	{
		path: 'appearance',
		loadChildren: () => import('./features/appearance/appearance.module').then(m => m.AppearanceModule),
		canActivate: [authGuard]
	},
	{
		path: 'audit',
		loadChildren: () => import('./features/audit/audit.module').then(m => m.AuditModule),
		canActivate: [authGuard]
	},
	{
		path: 'project-control',
		loadComponent: () => import('./features/project-control/pages/project-control-page/project-control-page.component').then(m => m.ProjectControlPageComponent),
		canActivate: [authGuard]
	},
	{
		path: '**',
		redirectTo: 'dashboard'
	}
];
