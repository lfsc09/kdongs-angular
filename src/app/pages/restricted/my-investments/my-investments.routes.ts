import { Routes } from '@angular/router';
import { titleResolver } from '../../../app.routes';
import { permissionGuard } from '../../../infra/guards/permission.guard';

export const myInvestmentsRoutes: Routes = [
	{
		path: '',
		data: {
			title: 'My Investments',
			shouldRouteExec: true,
			permission: 'INVESTMENTS_ACCESS',
		},
		title: titleResolver,
		loadComponent: () => import('./my-investments-dash/my-investments-dash.component').then((module) => module.MyInvestmentsDashComponent),
		canMatch: [permissionGuard],
	},
	{ path: '**', redirectTo: '', pathMatch: 'full' },
];
