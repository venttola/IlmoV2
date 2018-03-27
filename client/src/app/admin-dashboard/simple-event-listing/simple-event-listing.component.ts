import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { EventService } from "../../events/shared/event.service";
import { Event } from "../../events/shared/event.model";
@Component({
  selector: 'app-simple-event-listing',
  templateUrl: './simple-event-listing.component.html',
  styleUrls: ['./simple-event-listing.component.css']
})
export class SimpleEventListingComponent implements OnInit {
  events$: Observable<Event[]>;

  private selectedId: number;
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.events$ = this.route.paramMap
      .switchMap((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        this.selectedId = +params.get('id');
        return this.eventService.getEventListing();
      });
  }

}
