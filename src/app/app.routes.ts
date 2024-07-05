import { Routes } from '@angular/router';
import { gatekeeperGuard } from './gatekeeper.guard';
import { LandingPageComponent } from './pages/module/public/landing-page/landing-page.component';
import { HomeComponent } from './pages/module/restricted/home/home/home.component';

export const routes: Routes = [
	{ path: 'gate', loadComponent: () => LandingPageComponent, canActivate: [gatekeeperGuard] },
	{ path: 'home', loadComponent: () => HomeComponent, canActivate: [gatekeeperGuard] },
	{ path: '**', redirectTo: 'gate', pathMatch: 'full' },
];
