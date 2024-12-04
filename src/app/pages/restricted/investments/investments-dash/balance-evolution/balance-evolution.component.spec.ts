import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceEvolutionComponent } from './balance-evolution.component';

describe('BalanceEvolutionComponent', () => {
  let component: BalanceEvolutionComponent;
  let fixture: ComponentFixture<BalanceEvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceEvolutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
