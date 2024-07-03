import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { GatekeeperGuard } from './gatekeeper.guard';

describe('gatekeeperGuard', () => {
	let gatekeeperGuard: GatekeeperGuard;
	let routerSpy = { parseUrl: jasmine.createSpy('parseUrl') };

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [GatekeeperGuard, { provide: Router, useValue: routerSpy }],
		});
		gatekeeperGuard = TestBed.inject(GatekeeperGuard);
	});

	it('should be created', () => {
		expect(gatekeeperGuard).toBeTruthy();
	});

	it('[isValidToken=false][url="/gate"] should return "true" since doesnt have token but it is already at gate', () => {
		spyOn(gatekeeperGuard, 'isValidToken').and.returnValue(false);
		let currentRoute = {
			url: [{ path: 'gate' }],
		} as ActivatedRouteSnapshot;
		const result = gatekeeperGuard.canActivate(currentRoute);
		expect(result).toBeTruthy();
	});

	it('[isValidToken=false][url="/someplace"] should return UrlTree "/gate" since doesnt have token', () => {
		spyOn(gatekeeperGuard, 'isValidToken').and.returnValue(false);
		let currentRoute = {
			url: [{ path: 'someplace' }],
		} as ActivatedRouteSnapshot;
        
		gatekeeperGuard.canActivate(currentRoute);
		expect(routerSpy.parseUrl).toHaveBeenCalledWith('/gate');
	});

	it('[isValidToken=true][url="/gate"] should return UrlTree "/home" since it does have a token', () => {
		spyOn(gatekeeperGuard, 'isValidToken').and.returnValue(true);
		let currentRoute = {
			url: [{ path: 'gate' }],
		} as ActivatedRouteSnapshot;

		gatekeeperGuard.canActivate(currentRoute);
		expect(routerSpy.parseUrl).toHaveBeenCalledWith('/home');
	});

	// Invalid routes are not treated in the guard, they are always redirected to /gate in the Routes config
	it('[isValidToken=true][url="/home"] should return "true" since it does have a token and url is a valid route', () => {
		spyOn(gatekeeperGuard, 'isValidToken').and.returnValue(true);
		let currentRoute = {
			url: [{ path: 'home' }],
		} as ActivatedRouteSnapshot;
		const result = gatekeeperGuard.canActivate(currentRoute);
		expect(result).toBeTruthy();
	});
});
