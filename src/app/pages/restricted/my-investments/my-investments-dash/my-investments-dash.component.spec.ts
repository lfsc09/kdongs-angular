import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInvestmentsDashComponent } from './my-investments-dash.component';

describe('MyInvestmentsDashComponent', () => {
  let component: MyInvestmentsDashComponent;
  let fixture: ComponentFixture<MyInvestmentsDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyInvestmentsDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInvestmentsDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
