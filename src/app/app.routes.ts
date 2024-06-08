import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/module/public/landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'gate', loadComponent: () => LandingPageComponent }
];
