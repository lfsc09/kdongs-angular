import { TestBed } from '@angular/core/testing';

import { ViewportManagerService } from './viewport-manager.service';

describe('ViewportManagerService', () => {
  let service: ViewportManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewportManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
