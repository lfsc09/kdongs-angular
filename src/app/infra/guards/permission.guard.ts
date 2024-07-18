import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { TokenManagerService } from '../services/token/token-manager.service';

export const permissionGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
	const allow: boolean = inject(TokenManagerService).tokenData()?.perms[route?.data?.['permission'] ?? ''] ?? false;
    if (allow) return true;

    const router = inject(Router);
    if (segments.length === 0) return router.parseUrl('/r!');
    return router.parseUrl('');
};
