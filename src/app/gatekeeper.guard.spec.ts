import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { gatekeeperGuard } from './gatekeeper.guard';

describe('gatekeeperGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => gatekeeperGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
