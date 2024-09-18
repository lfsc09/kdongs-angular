import { TestBed } from '@angular/core/testing';

import { MyInvestmentsGatewayService } from './my-investments-gateway.service';

describe('MyInvestmentsGatewayService', () => {
  let service: MyInvestmentsGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyInvestmentsGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
