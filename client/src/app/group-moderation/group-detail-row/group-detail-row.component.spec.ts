import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailRowComponent } from './group-detail-row.component';

describe('GroupDetailRowComponent', () => {
  let component: GroupDetailRowComponent;
  let fixture: ComponentFixture<GroupDetailRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDetailRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
