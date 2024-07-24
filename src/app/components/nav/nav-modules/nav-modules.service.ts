import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { TokenManagerService } from '../../../infra/services/token/token-manager.service';

@Injectable({
	providedIn: 'root',
})
export class NavModulesService {
	/**
	 * SERVICES
	 */
	private readonly tokenManagerService = inject(TokenManagerService);
	private readonly router = inject(Router);

	/**
	 * SIGNALS
	 */
	private _opened: WritableSignal<boolean> = signal(false);
	opened = this._opened.asReadonly();
	modules = computed(() =>
		[
			{
				title: 'Home',
				icon: 'faHouse',
				url: '/r!/home',
			},
			this.tokenManagerService.tokenData()?.perms['USERS_ACCESS'] ?? false
				? {
						title: 'Manage Users',
						icon: 'faUsersGear',
						url: '/r!/users',
					}
				: null,
			this.tokenManagerService.tokenData()?.perms['INVESTMENTS_ACCESS'] ?? false
				? {
						title: 'My Investments',
						icon: 'faChartPie',
						url: '/r!/investments',
					}
				: null,
			this.tokenManagerService.tokenData()?.perms['EXPENSES_ACCESS'] ?? false
				? {
						title: 'My Expenses',
						icon: 'faCreditCard',
						url: '/r!/expenses',
					}
				: null,
			this.tokenManagerService.tokenData()?.perms['STOCKS_ANALYSE_ACCESS'] ?? false
				? {
						title: 'Stocks Studies',
						icon: 'faMagnifyingGlassChart',
						url: '/r!/stocks-analyse',
					}
				: null,
		].filter((v) => !!v),
	);

	// TODO: Build the Routes tree for suggestions. MUST NOT suggest routes that user have no permission
	// TODO: When running Routes maybe use `:` prefix to specify a route `:param`, and `?` for specifying queryParams.
	/**
	 * TIP: Inside `data` on each Route in the config, say if the Route should be considered for this.
	 *      Also inside `data` of dynamic Routes with `:param` give the REGEX information, if the `:param` should have restricted values.
	 */
	private _routesRegexp = computed<RegExp[]>(() => {
		return this.buildRoutesRegexp('', this.router.config, this.tokenManagerService.tokenData()?.perms ?? {});
	});

	/**
	 * FUNCTIONS
	 */
	handleOpen() {
		if (!this._opened()) this._opened.set(true);
	}

	handleClose() {
		this._opened.set(false);
	}

	// Check if the route given to navigate is valid
	isExecutableRoute(route: string) {
		return this._routesRegexp().some((rRegExp) => rRegExp.test(route));
	}

	private buildRoutesRegexp(currRegExp: string, routes: Routes, userPerms: { [key: string]: boolean }): RegExp[] {
		let regExps: RegExp[] = [];
		for (let route of routes) {
			// Check if route should be used in ExecutableRoutes
			let considerThisRoute = route.data?.['shouldRouteExec'] ?? false;

			// If route uses `permissionGuard`, check if users have permissions
			if (considerThisRoute && (route.canMatch?.some((cM) => cM?.name === 'permissionGuard') ?? false)) {
				considerThisRoute &&= userPerms[route.data?.['permission']] ?? false;
			}

			// build currRegExp with default `path` or `routeExecRegExp`
			let regExp: string = currRegExp;
			if (route.data && 'routeExecRegExp' in route.data) {
				regExp += route.data['routeExecRegExp'];
			} else regExp += route.path !== '' ? `/${route.path}` : '';

			if (considerThisRoute) regExps.push(new RegExp(`^${regExp}$`));

			// look at its children
			if (route.children?.length ?? 0) {
				const childrenRegExps = this.buildRoutesRegexp(regExp, route.children!, userPerms);
				regExps.push(...childrenRegExps);
			}
		}
		return regExps;
	}
}
