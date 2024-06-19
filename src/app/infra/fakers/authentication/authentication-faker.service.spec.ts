import { TestBed } from '@angular/core/testing';

import { AuthenticationFakerService } from './authentication-faker.service';

describe('AuthenticationFakerService', () => {
  let service: AuthenticationFakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationFakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
