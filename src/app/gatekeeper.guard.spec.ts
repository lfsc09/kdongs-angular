import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { gatekeeperGuard } from './gatekeeper.guard';
import { TokenManagerService } from './infra/services/token/token-manager.service';

describe('gatekeeperGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => gatekeeperGuard(...guardParameters));
	let routerSpy = { parseUrl: jasmine.createSpy('parseUrl') };
	let tokenManagerSpy = { processToken: jasmine.createSpy('processToken') };

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: Router, useValue: routerSpy },
				{ provide: TokenManagerService, useValue: tokenManagerSpy },
			],
		});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});

	it('[isValidToken=false][url="/gate"] should return "true" since doesnt have token but it is already at gate', () => {
		tokenManagerSpy.processToken.and.returnValue(false);
		let route = {
			url: [{ path: 'gate' }],
		} as ActivatedRouteSnapshot;
		const result = executeGuard(route, {} as RouterStateSnapshot);
		expect(result).toBeTruthy();
	});

	it('[isValidToken=false][url="/someplace"] should return UrlTree "/gate" since doesnt have token', () => {
		tokenManagerSpy.processToken.and.returnValue(false);
		let route = {
			url: [{ path: 'someplace' }],
		} as ActivatedRouteSnapshot;

		executeGuard(route, {} as RouterStateSnapshot);
		expect(routerSpy.parseUrl).toHaveBeenCalledWith('/gate');
	});

	it('[isValidToken=true][url="/gate"] should return UrlTree "/home" since it does have a token', () => {
		tokenManagerSpy.processToken.and.returnValue(true);
		let route = {
			url: [{ path: 'gate' }],
		} as ActivatedRouteSnapshot;

		executeGuard(route, {} as RouterStateSnapshot);
		expect(routerSpy.parseUrl).toHaveBeenCalledWith('/home');
	});

	// Invalid routes are not treated in the guard, they are always redirected to /gate in the Routes config
	it('[isValidToken=true][url="/home"] should return "true" since it does have a token and url is a valid route', () => {
		tokenManagerSpy.processToken.and.returnValue(true);
		let route = {
			url: [{ path: 'home' }],
		} as ActivatedRouteSnapshot;
		const result = executeGuard(route, {} as RouterStateSnapshot);
		expect(result).toBeTruthy();
	});
});
