import { TestBed } from '@angular/core/testing';
import { addHours, subDays } from 'date-fns';
import { InvalidTokenError } from 'jwt-decode';
import { TokenData } from './token-manager.model';
import { TokenManagerService } from './token-manager.service';

describe('TokenManagerService', () => {
	let service: TokenManagerService;
    const jacintoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3Yzc1ZWIyNS1iYzk5LTQxNWItYmU1YS1jOTdkYjZkYTY5MjgiLCJ1c2VyRW1haWwiOiJqYWNpbnRvLnBpbnRvQGdtYWlsLmNvbSIsInVzZXJGdWxsbmFtZSI6IkphY2ludG8gUGludG8iLCJwZXJtcyI6eyJVU0VSU19BQ0NFU1MiOnRydWUsIlVTRVJTX05FVyI6dHJ1ZSwiVVNFUlNfRURJVCI6dHJ1ZSwiVVNFUlNfU0RFTCI6dHJ1ZSwiSU5WRVNUTUVOVFNfQUNDRVNTIjp0cnVlLCJJTlZFU1RNRU5UU19ORVciOnRydWUsIklOVkVTVE1FTlRTX0VESVQiOnRydWUsIklOVkVTVE1FTlRTX0hERUwiOnRydWUsIkVYUEVOU0VTX0FDQ0VTUyI6dHJ1ZSwiRVhQRU5TRVNfTkVXIjp0cnVlLCJFWFBFTlNFU19FRElUIjp0cnVlLCJFWFBFTlNFU19IREVMIjp0cnVlfSwiaG9zdCI6Imtkb25ncyIsImlhdCI6NDUxNjIzOTAyMn0.BEuJ2myqC3C20VsHCe7zRHp5lKCvm39vv1nD2d2tH6w';

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
		const decoded = service['decode'](jacintoToken);
		expect(decoded).not.toBeNull();
		expect(decoded?.userEmail).toBe('jacinto.pinto@gmail.com');
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

	it('(clear) should clear token data of service', () => {
		service['_token'].set('justatesttoken');
		service['_tokenData'].set({
			userEmail: 'test',
		} as TokenData);
		expect(service['_token']()).toBe('justatesttoken');
		expect(service['_tokenData']()!.userEmail).toBe('test');
		service.clear();
		expect(service.token).toBeNull();
		expect(service.tokenData).toBeNull();
	});

	it('(extractToken) should extract a valid token', () => {
		const result = service['extractToken'](jacintoToken);
		expect(result?.userEmail).toBe('jacinto.pinto@gmail.com');
	});

	it('(extractToken) should return "null"', () => {
		const result = service['extractToken']('justsometoken');
		expect(result).toBeNull();
	});
});
