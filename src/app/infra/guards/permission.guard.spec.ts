import { TestBed } from '@angular/core/testing';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';

import { TokenData } from '../services/token/token-manager.model';
import { TokenManagerService } from '../services/token/token-manager.service';
import { permissionGuard } from './permission.guard';

describe('permissionGuard', () => {
	const executeGuard: CanMatchFn = (...guardParameters) => TestBed.runInInjectionContext(() => permissionGuard(...guardParameters));
	let tokenManagerService: TokenManagerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [TokenManagerService],
		});
		tokenManagerService = TestBed.inject(TokenManagerService);
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});

	it('[tokenData=null][routePermission="ROUTE_PERMISSION"] should return "false" since there is no TokenData', () => {
		spyOn(tokenManagerService, 'tokenData').and.returnValue(null);
		const route = {
			data: {
				permission: 'ROUTE_PERMISSION',
			},
		} as Route;
		const result = executeGuard(route, [] as UrlSegment[]);
		expect(result).toBeFalse();
	});

	it('[tokenData=valid][routePermission="ROUTE_PERMISSION"] should return "false" the user does not have the permission', () => {
		spyOn(tokenManagerService, 'tokenData').and.returnValue({
			perms: {
				ROUTE_PERMISSION: false,
			} as { [key: string]: boolean },
		} as TokenData);
		const route = {
			data: {
				permission: 'ROUTE_PERMISSION',
			},
		} as Route;
		const result = executeGuard(route, [] as UrlSegment[]);
		expect(result).toBeFalse();
	});

    it('[tokenData=valid][routePermission="ROUTE_PERMISSION"] should return "false" the route permission does not exist on the Token', () => {
		spyOn(tokenManagerService, 'tokenData').and.returnValue({
			perms: {
				ROUTE_PERMISSION: true,
			} as { [key: string]: boolean },
		} as TokenData);
		const route = {
			data: {
				permission: 'ROUTE_PERMISSION2',
			},
		} as Route;
		const result = executeGuard(route, [] as UrlSegment[]);
		expect(result).toBeFalse();
	});

    it('[tokenData=valid][routePermission="ROUTE_PERMISSION"] should return "true" the user have permission', () => {
		spyOn(tokenManagerService, 'tokenData').and.returnValue({
			perms: {
				ROUTE_PERMISSION: true,
			} as { [key: string]: boolean },
		} as TokenData);
		const route = {
			data: {
				permission: 'ROUTE_PERMISSION',
			},
		} as Route;
		const result = executeGuard(route, [] as UrlSegment[]);
		expect(result).toBeTruthy();
	});
});
