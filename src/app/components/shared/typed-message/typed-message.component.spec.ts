import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedMessageComponent } from './typed-message.component';

describe('TypedMessageComponent', () => {
  let component: TypedMessageComponent;
  let fixture: ComponentFixture<TypedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypedMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
