import { TestBed } from '@angular/core/testing';
import { addHours, subDays } from 'date-fns';
import { InvalidTokenError } from 'jwt-decode';
import { TokenData } from './token-manager.model';
import { TokenManagerService } from './token-manager.service';

describe('TokenManagerService', () => {
	let service: TokenManagerService;
    const jacintoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3Yzc1ZWIyNS1iYzk5LTQxNWItYmU1YS1jOTdkYjZkYTY5MjgiLCJ1c2VyVXNlcm5hbWUiOiJqYWNpbnRvLnBpbnRvIiwidXNlckZ1bGxuYW1lIjoiSmFjaW50byBQaW50byIsInBlcm1zIjp7IlVTRVJTX0FDQ0VTUyI6dHJ1ZSwiVVNFUlNfTkVXIjp0cnVlLCJVU0VSU19FRElUIjp0cnVlLCJVU0VSU19TREVMIjp0cnVlLCJJTlZFU1RNRU5UU19BQ0NFU1MiOnRydWUsIklOVkVTVE1FTlRTX05FVyI6dHJ1ZSwiSU5WRVNUTUVOVFNfRURJVCI6dHJ1ZSwiSU5WRVNUTUVOVFNfSERFTCI6dHJ1ZSwiRVhQRU5TRVNfQUNDRVNTIjp0cnVlLCJFWFBFTlNFU19ORVciOnRydWUsIkVYUEVOU0VTX0VESVQiOnRydWUsIkVYUEVOU0VTX0hERUwiOnRydWV9LCJob3N0Ijoia2RvbmdzIiwiaWF0Ijo0NTE2MjM5MDIyfQ.JonsbF-LoyrUwftwTS_bBqSOjDHFXTvb3YtK0LRlWpc';

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
		expect(decoded?.userUsername).toBe('jacinto.pinto');
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
			userUsername: 'test',
		} as TokenData);
		expect(service['_token']()).toBe('justatesttoken');
		expect(service['_tokenData']()!.userUsername).toBe('test');
		service.clear();
		expect(service.token).toBeNull();
		expect(service.tokenData).toBeNull();
	});

	it('(extractToken) should extract a valid token', () => {
		const result = service['extractToken'](jacintoToken);
		expect(result?.userUsername).toBe('jacinto.pinto');
	});

	it('(extractToken) should return "null"', () => {
		const result = service['extractToken']('justsometoken');
		expect(result).toBeNull();
	});
});
