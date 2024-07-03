import { Routes } from '@angular/router';
import { GatekeeperGuard } from './gatekeeper.guard';
import { LandingPageComponent } from './pages/module/public/landing-page/landing-page.component';

export const routes: Routes = [
	{ path: 'gate', loadComponent: () => LandingPageComponent, canActivate: [GatekeeperGuard] },
	{ path: '**', redirectTo: 'gate', pathMatch: 'full' },
];
