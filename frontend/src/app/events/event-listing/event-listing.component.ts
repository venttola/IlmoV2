import { Component, OnInit } from "@angular/core";

import { AuthService } from "../../authentication/auth.service";
import { EventService } from "../shared/event.service";

import { Event } from "../shared/event.model"; 
@Component({
  selector: "event-listing",
  templateUrl: "./event-listing.component.html",
  styleUrls: ["./event-listing.component.css"]
})

export class EventListingComponent implements OnInit {
  events: Event[];
  error: any;
  constructor(private eventService: EventService,
              private authService: AuthService) {
  }
  ngOnInit() {
  	this.getEvents();

  }
   getEvents(){
  	this.eventService.getEventListing().subscribe(events => this.events = events,
  												  error => this.error = <any>error);
  }
}
