import { TestBed } from '@angular/core/testing';

import { UsersGatewayService } from './users-gateway.service';

describe('UsersGatewayService', () => {
  let service: UsersGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
