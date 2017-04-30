import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreatorComponentComponent } from './event-creator-component.component';

describe('EventCreatorComponentComponent', () => {
  let component: EventCreatorComponentComponent;
  let fixture: ComponentFixture<EventCreatorComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCreatorComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCreatorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
