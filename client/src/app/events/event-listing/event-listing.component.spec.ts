import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListingComponent } from './event-listing.component';
import { Router, RouterModule } from "@angular/router";
import { EventService } from "../shared/event.service";
import { HttpModule } from "@angular/http";

describe('EventListingComponent', () => {
  let component: EventListingComponent;
  let fixture: ComponentFixture<EventListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, HttpModule],
      declarations: [ EventListingComponent ],
      providers: [EventService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
