import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { TokenManagerService } from '../services/token/token-manager.service';

export const gatekeeperGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
	const firstSegment = segments?.[0]?.path ?? '';
	const isValidToken = inject(TokenManagerService).processToken();
	const router = inject(Router);

	// If no token found
	if (!isValidToken) {
		// If already at gate, just allow
		if (firstSegment === 'gate') return true;

		// Otherwise must route to gate
		return router.parseUrl('/gate');
	}

	// If have token but I am at gate, go to `r!` (restricted section)
	if (firstSegment === 'gate') return router.parseUrl('/r!');

	// If have token and trying to reach other known routes, just allow
	return true;
};
