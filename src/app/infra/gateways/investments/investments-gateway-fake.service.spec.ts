import { TestBed } from '@angular/core/testing';

import { InvestmentsGatewayFakeService } from './investments-gateway-fake.service';

describe('MyInvestmentsGatewayFakeService', () => {
	let service: InvestmentsGatewayFakeService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(InvestmentsGatewayFakeService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
