import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { gatekeeperGuard } from './gatekeeper.guard';
import { environment } from '../environments/environment';

const titleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
    return `${environment.title} - ${route.data['title']}`;
}

export const routes: Routes = [
	{
		path: 'gate',
        data: {
            title: 'Gate',
        },
        title: titleResolver,
		loadComponent: () => import('./pages/module/public/landing-page/landing-page.component').then((module) => module.LandingPageComponent),
		canActivate: [gatekeeperGuard],
	},
	{
		path: 'r!',
		loadComponent: () => import('./pages/module/restricted/restricted-page/restricted-page.component').then((module) => module.RestrictedPageComponent),
		canActivate: [gatekeeperGuard],
		children: [
			{
				path: 'home',
                data: {
                    title: 'Home',
                },
                title: titleResolver,
				loadComponent: () => import('./pages/module/restricted/home/home.component').then((module) => module.HomeComponent),
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
