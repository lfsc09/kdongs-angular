import { TestBed } from '@angular/core/testing';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { TokenManagerService } from '../services/token/token-manager.service';
import { gatekeeperGuard } from './gatekeeper.guard';

describe('gatekeeperGuard', () => {
	const executeGuard: CanMatchFn = (...guardParameters) => TestBed.runInInjectionContext(() => gatekeeperGuard(...guardParameters));
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
		const result = executeGuard({} as Route, [{ path: 'gate' }] as UrlSegment[]);
		expect(result).toBeTruthy();
	});

	it('[isValidToken=false][url="/someplace"] should return UrlTree "/gate" since doesnt have token', () => {
		tokenManagerSpy.processToken.and.returnValue(false);
		executeGuard({} as Route, [{ path: 'someplace' }] as UrlSegment[]);
		expect(routerSpy.parseUrl).toHaveBeenCalledWith('/gate');
	});

	it('[isValidToken=true][url="/gate"] should return UrlTree "/home" since it does have a token', () => {
		tokenManagerSpy.processToken.and.returnValue(true);
		executeGuard({} as Route, [{ path: 'gate' }] as UrlSegment[]);
		expect(routerSpy.parseUrl).toHaveBeenCalledWith('/home');
	});

	// Invalid routes are not treated in the guard, they are always redirected to /gate in the Routes config
	it('[isValidToken=true][url="/home"] should return "true" since it does have a token and url is a valid route', () => {
		tokenManagerSpy.processToken.and.returnValue(true);
		const result = executeGuard({} as Route, [{ path: 'home' }] as UrlSegment[]);
		expect(result).toBeTruthy();
	});
});
