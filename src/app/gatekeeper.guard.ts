import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenManagerService } from './infra/services/token/token-manager.service';

export const gatekeeperGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const firstSegment = route?.url?.[0]?.path ?? '';
	const isValidToken = inject(TokenManagerService).processToken();
	const router = inject(Router);

	// If no token found
	if (!isValidToken) {
		// If already at gate, just allow
		if (firstSegment === 'gate') return true;

		// Otherwise must route to gate
		return router.parseUrl('/gate');
	}

	// If have token but I am at gate, go to home
	if (firstSegment === 'gate') return router.parseUrl('/home');

	// If have token and trying to reach other known routes, just allow
	return true;
};
