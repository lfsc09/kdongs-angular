import { TestBed } from '@angular/core/testing';
import { addHours, subDays } from 'date-fns';
import { InvalidTokenError } from 'jwt-decode';
import { TokenData } from './token-manager.model';
import { TokenManagerService } from './token-manager.service';

describe('TokenManagerService', () => {
	let service: TokenManagerService;
    const jacintoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjNzVlYjI1LWJjOTktNDE1Yi1iZTVhLWM5N2RiNmRhNjkyOCIsInVzZXJuYW1lIjoiamFjaW50by5waW50byIsIm5hbWUiOiJKYWNpbnRvIFBpbnRvIiwicGVybXMiOnsiVVNFUlNfQUNDRVNTIjp0cnVlLCJVU0VSU19SRUdJU1RFUiI6dHJ1ZSwiVVNFUlNfRURJVCI6dHJ1ZSwiVVNFUlNfU0RFTCI6dHJ1ZSwiSU5WRVNUTUVOVFNfQUNDRVNTIjp0cnVlLCJJTlZFU1RNRU5UU19SRUdJU1RFUiI6dHJ1ZSwiSU5WRVNUTUVOVFNfRURJVCI6dHJ1ZSwiSU5WRVNUTUVOVFNfSERFTCI6dHJ1ZSwiRVhQRU5TRVNfQUNDRVNTIjp0cnVlLCJFWFBFTlNFU19SRUdJU1RSQVRJT04iOnRydWUsIkVYUEVOU0VTX0VESVQiOnRydWUsIkVYUEVOU0VTX0hERUwiOnRydWV9LCJob3N0Ijoia2RvbmdzIiwiaWF0Ijo0NTE2MjM5MDIyfQ.6zSi31-JN-KPgfzutfETiMvA-IoQwiq1wTUN7oyijRw';

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
		expect(decoded?.username).toBe('jacinto.pinto');
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
			username: 'test',
		} as TokenData);
		expect(service['_token']()).toBe('justatesttoken');
		expect(service['_tokenData']()!.username).toBe('test');
		service.clear();
		expect(service.token).toBeNull();
		expect(service.tokenData).toBeNull();
	});

	it('(extractToken) should extract a valid token', () => {
		const result = service['extractToken'](jacintoToken);
		expect(result?.username).toBe('jacinto.pinto');
	});

	it('(extractToken) should return "null"', () => {
		const result = service['extractToken']('justsometoken');
		expect(result).toBeNull();
	});
});
