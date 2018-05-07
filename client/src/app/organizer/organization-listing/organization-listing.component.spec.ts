import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationListingComponent } from './organization-listing.component';

describe('OrganizationListingComponent', () => {
  let component: OrganizationListingComponent;
  let fixture: ComponentFixture<OrganizationListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
