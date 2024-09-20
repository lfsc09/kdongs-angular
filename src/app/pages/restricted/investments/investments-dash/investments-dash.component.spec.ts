import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsDashComponent } from './investments-dash.component';

describe('MyInvestmentsDashComponent', () => {
	let component: InvestmentsDashComponent;
	let fixture: ComponentFixture<InvestmentsDashComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [InvestmentsDashComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(InvestmentsDashComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
