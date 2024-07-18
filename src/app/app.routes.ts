import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { gatekeeperGuard } from './infra/guards/gatekeeper.guard';
import { userRoutes } from './pages/restricted/users/users.routes';

export const titleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
	return `${environment.title} - ${route.data['title']}`;
};

export const routes: Routes = [
	{
		path: 'gate',
		data: {
			title: 'Gate',
		},
		title: titleResolver,
		loadComponent: () => import('./pages/public/landing-page/landing-page.component').then((module) => module.LandingPageComponent),
		canMatch: [gatekeeperGuard],
	},
	{
		path: 'r!',
		loadComponent: () => import('./pages/restricted/restricted-page/restricted-page.component').then((module) => module.RestrictedPageComponent),
		canMatch: [gatekeeperGuard],
		children: [
			{
				path: 'home',
				data: {
					title: 'Home',
				},
				title: titleResolver,
				loadComponent: () => import('./pages/restricted/home/home.component').then((module) => module.HomeComponent),
			},
			{
				path: 'users',
				children: userRoutes,
			},
			{
				path: '**',
				redirectTo: 'home',
				pathMatch: 'full',
			},
		],
	},
	{ path: '**', redirectTo: 'gate', pathMatch: 'full' },
];
