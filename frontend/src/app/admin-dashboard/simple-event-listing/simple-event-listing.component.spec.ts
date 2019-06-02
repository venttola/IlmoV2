import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleEventListingComponent } from './simple-event-listing.component';

describe('SimpleEventListingComponent', () => {
  let component: SimpleEventListingComponent;
  let fixture: ComponentFixture<SimpleEventListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleEventListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleEventListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
