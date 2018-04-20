import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupListingComponent } from './signup-listing.component';

describe('SignupListingComponent', () => {
  let component: SignupListingComponent;
  let fixture: ComponentFixture<SignupListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
