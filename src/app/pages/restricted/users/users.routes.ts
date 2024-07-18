import { Routes } from '@angular/router';
import { titleResolver } from '../../../app.routes';
import { permissionGuard } from '../../../infra/guards/permission.guard';

export const userRoutes: Routes = [
	{
		path: '',
		data: {
			title: 'Users',
			permission: 'USERS_ACCESS',
		},
		title: titleResolver,
		loadComponent: () => import('./users.component').then((module) => module.UsersComponent),
		canMatch: [permissionGuard],
	},
	{ path: '**', redirectTo: '', pathMatch: 'full' },
];
