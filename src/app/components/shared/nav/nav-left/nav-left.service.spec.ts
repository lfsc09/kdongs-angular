import { TestBed } from '@angular/core/testing';

import { NavLeftService } from './nav-left.service';

describe('NavLeftService', () => {
  let service: NavLeftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavLeftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
