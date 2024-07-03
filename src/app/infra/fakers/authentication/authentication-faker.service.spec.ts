import { TestBed } from '@angular/core/testing';

import { AuthenticationFakerService } from './authentication-faker.service';

describe('AuthenticationFakerService', () => {
	let service: AuthenticationFakerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AuthenticationFakerService],
		});
		service = TestBed.inject(AuthenticationFakerService);
        service.requestTime = 500;
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('(findUserByEmailAndPassword)[fakeFailRequest()=false] should return user token', async () => {
        spyOn(service, 'fakeFailRequest').and.returnValue(false);
		await expectAsync(service.findUserByEmailAndPassword('jacinto.pinto', '123456')).toBeResolvedTo(
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjNzVlYjI1LWJjOTktNDE1Yi1iZTVhLWM5N2RiNmRhNjkyOCIsIm5hbWUiOiJKYWNpbnRvIFBpbnRvIiwidXNlcm5hbWUiOiJqYWNpbnRvLnBpbnRvIiwiaG9zdCI6Imtkb25ncyIsImFkbWluX2ZsYWciOnRydWUsImlhdCI6NDUxNjIzOTAyMn0.81oWn-SEq3ZeqVYeb30u7KQOcMuIa_01Iwc9PXard7Y',
		);
	});

    it('(findUserByEmailAndPassword)[fakeFailRequest()=false] should return null token because of wrong data', async () => {
        spyOn(service, 'fakeFailRequest').and.returnValue(false);
		await expectAsync(service.findUserByEmailAndPassword('jacinto', 'wrongpass')).toBeResolvedTo(null);
	});

    it('(findUserByEmailAndPassword)[fakeFailRequest()=true] should fail request because of `fakeFailRequest`', async () => {
        spyOn(service, 'fakeFailRequest').and.returnValue(true);
        await expectAsync(service.findUserByEmailAndPassword('jacinto.pinto', '123456')).toBeRejectedWithError('Request Failed');
    });
});
