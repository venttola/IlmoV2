import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCheckoutPageComponent } from './group-checkout-page.component';

describe('GroupCheckoutPageComponent', () => {
  let component: GroupCheckoutPageComponent;
  let fixture: ComponentFixture<GroupCheckoutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCheckoutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCheckoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
