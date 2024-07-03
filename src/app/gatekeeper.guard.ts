import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { TokenManagerService } from './infra/services/token/token-manager.service';

@Injectable({
	providedIn: 'root',
})
export class GatekeeperGuard implements CanActivate {
	constructor(
		readonly router: Router,
		readonly tokenManager: TokenManagerService,
	) {}

	canActivate(route: ActivatedRouteSnapshot): MaybeAsync<GuardResult> {
		const firstSegment = route?.url?.[0]?.path ?? '';
		const isValidToken = this.isValidToken();

		// If no token found
		if (!isValidToken) {
			// If already at gate, just allow
			if (firstSegment === 'gate') return true;

			// Otherwise must route to gate
			return this.router.parseUrl('/gate');
		}

		// If have token but I am at gate, go to home
		if (firstSegment === 'gate') return this.router.parseUrl('/home');

		// If have token and trying to reach other known routes, just allow
		return true;
	}

	isValidToken(): boolean {
		return this.tokenManager.processToken();
	}
}
