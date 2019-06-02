import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EventsService } from "../events.service";
import { Event } from "../../../events/shared/event.model";
@Component({
  selector: 'organizer-event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.css']
})
export class EventOverviewComponent implements OnInit {
  event: Event;
  products: any[];
  overview$: Observable<any>;
  private organizationId: number;
  private eventId: number;
  constructor(private route: ActivatedRoute,
              private eventsService: EventsService) {
    this.event = new Event();
    this.products = new Array<any>();
  }
  ngOnInit() {
    console.log("initing event overview");
    this.route.parent.paramMap
      .switchMap((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        this.organizationId = +params.get('id')
        this.eventId = +params.get('eventId')
        return this.eventsService.getEventOverview(this.organizationId, this.eventId);
      }).subscribe(overview => {
        this.event = overview.event;
        this.products = overview.products;
     });
  }
}
