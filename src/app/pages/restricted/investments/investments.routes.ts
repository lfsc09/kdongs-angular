import { Routes } from '@angular/router';
import { titleResolver } from '../../../app.routes';
import { permissionGuard } from '../../../infra/guards/permission.guard';

export const investmentsRoutes: Routes = [
	{
		path: '',
		data: {
			title: 'My Investments',
			shouldRouteExec: true,
			permission: 'INVESTMENTS_ACCESS',
		},
		title: titleResolver,
		loadComponent: () => import('./investments-dash/investments-dash.component').then((module) => module.InvestmentsDashComponent),
		canMatch: [permissionGuard],
	},
	{ path: '**', redirectTo: '', pathMatch: 'full' },
];
