import { TestBed } from '@angular/core/testing';

import { KdsDatapoolService } from './kds-datapool.service';

describe('KdsDatapoolService', () => {
  let service: KdsDatapoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KdsDatapoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
