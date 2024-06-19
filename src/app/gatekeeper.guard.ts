import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const gatekeeperGuard: CanActivateFn = (route, state) => {
	const firstSegment = route.url[0].path;
	const haveToken = false;
	const router = inject(Router);

	if (!haveToken) {
        if (firstSegment === 'gate') return true;
        return router.parseUrl('/gate');
    }
	if (firstSegment === 'gate') return router.parseUrl('/home');
	return true;
};
