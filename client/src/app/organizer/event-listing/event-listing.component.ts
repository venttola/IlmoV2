import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EventListingService } from "./event-listing.service";

import { Event } from "../../events/shared/event.model";
@Component({
  selector: 'organizer-event-listing',
  templateUrl: './event-listing.component.html',
  styleUrls: ['./event-listing.component.css','../../styles/common-list.style.css']
})
export class EventListingComponent implements OnInit {
  events$: Observable<Event[]>;

  private organizationId: number;
  constructor(
    private route: ActivatedRoute,
    private eventListingService: EventListingService
    ) { }

  ngOnInit() {
    this.events$ = this.route.parent.paramMap
      .switchMap((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        this.organizationId = +params.get('id');
        return this.eventListingService.getEvents(this.organizationId);
      });
  }
}
