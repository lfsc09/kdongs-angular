import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictedPageComponent } from './restricted-page.component';

describe('RestrictedPageComponent', () => {
  let component: RestrictedPageComponent;
  let fixture: ComponentFixture<RestrictedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestrictedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestrictedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
