import { TestBed } from '@angular/core/testing';

import { NavModulesService } from './nav-modules.service';

describe('NavLeftService', () => {
	let service: NavModulesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NavModulesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
