import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantAddingComponent } from './participant-adding.component';

describe('ParticipantAddingComponent', () => {
  let component: ParticipantAddingComponent;
  let fixture: ComponentFixture<ParticipantAddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantAddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantAddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
