import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSignupListingComponent } from './event-signup-listing.component';

describe('EventSignupListingComponent', () => {
  let component: EventSignupListingComponent;
  let fixture: ComponentFixture<EventSignupListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSignupListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSignupListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
