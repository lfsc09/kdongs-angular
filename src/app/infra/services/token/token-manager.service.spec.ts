import { TestBed } from '@angular/core/testing';
import { InvalidTokenError } from 'jwt-decode';
import { TokenData } from './token-manager.model';
import { TokenManagerService } from './token-manager.service';
import { addHours, subDays } from 'date-fns';

describe('TokenManagerService', () => {
	let service: TokenManagerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [TokenManagerService],
		});
		service = TestBed.inject(TokenManagerService);
	});

	it('should be created with "null" data', () => {
		expect(service).toBeTruthy();
		expect(service.token).toBeNull();
		expect(service.tokenData).toBeNull();
	});

	it('(decode) should decode a jwt token', () => {
		const decoded = service['decode'](
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjNzVlYjI1LWJjOTktNDE1Yi1iZTVhLWM5N2RiNmRhNjkyOCIsIm5hbWUiOiJKYWNpbnRvIFBpbnRvIiwidXNlcm5hbWUiOiJqYWNpbnRvLnBpbnRvIiwiaG9zdCI6Imtkb25ncyIsImFkbWluX2ZsYWciOnRydWUsImlhdCI6NDUxNjIzOTAyMn0.81oWn-SEq3ZeqVYeb30u7KQOcMuIa_01Iwc9PXard7Y',
		);
        expect(decoded).not.toBeNull();
		expect(decoded?.username ?? '').toBe('jacinto.pinto');
	});

	it('(decode) should not decode a jwt token', () => {
		expect(() => service['decode']('nonexistenttokenstring')).toThrow(new InvalidTokenError('Invalid token specified: missing part #2'));
	});

	it('(isValid)[tokenData=ok] should return "true"', () => {
		const newExp = addHours(new Date(), 4);
		const tokenData = {
			host: 'kdongs',
			exp: newExp.getTime() / 1000,
		} as TokenData;
		expect(service['isValid'](tokenData)).toBeTruthy();
	});

    it('(isValid)[host=somehost][exp=valid] should return "false" because of wrong host', () => {
		const newExp = addHours(new Date(), 4);
		const tokenData = {
			host: 'somehost',
			exp: newExp.getTime() / 1000,
		} as TokenData;
		expect(service['isValid'](tokenData)).toBeFalse();
	});

    it('(isValid)[host=kdongs][exp=invalid] should return "false" because of expired date', () => {
		const newExp = subDays(new Date(), 1);
		const tokenData = {
			host: 'kdongs',
			exp: newExp.getTime() / 1000,
		} as TokenData;
		expect(service['isValid'](tokenData)).toBeFalse();
	});
});
