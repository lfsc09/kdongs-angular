import { Routes } from '@angular/router';
import { titleResolver } from '../../../app.routes';
import { permissionGuard } from '../../../infra/guards/permission.guard';

export const userRoutes: Routes = [
	{
		path: '',
		data: {
			title: 'Users',
			shouldRouteExec: true,
			permission: 'USERS_ACCESS',
		},
		title: titleResolver,
		loadComponent: () => import('./users-list/users-list.component').then((module) => module.UsersListComponent),
		canMatch: [permissionGuard],
	},
	{ path: '**', redirectTo: '', pathMatch: 'full' },
];
