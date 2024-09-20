import { TestBed } from '@angular/core/testing';

import { InvestmentsGatewayService } from './investments-gateway.service';

describe('MyInvestmentsGatewayService', () => {
	let service: InvestmentsGatewayService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(InvestmentsGatewayService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
