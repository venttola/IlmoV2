import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupModerationComponent } from './group-moderation.component';

describe('GroupModerationComponent', () => {
  let component: GroupModerationComponent;
  let fixture: ComponentFixture<GroupModerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupModerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
