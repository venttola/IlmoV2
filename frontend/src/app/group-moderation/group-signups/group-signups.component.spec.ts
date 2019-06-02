import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSignupsComponent } from './group-signups.component';

describe('GroupSignupsComponent', () => {
  let component: GroupSignupsComponent;
  let fixture: ComponentFixture<GroupSignupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSignupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSignupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
