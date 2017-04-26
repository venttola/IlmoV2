import { Component, OnInit } from "@angular/core";
import { EventService } from "../event.service";
import { Event } from "../event.model"; 
@Component({
  selector: "event-listing",
  templateUrl: "./event-listing.component.html",
  styleUrls: ["./event-listing.component.css"]
})

export class EventListingComponent implements OnInit {
  private events: Event[];
  error: any;
  constructor(private eventService: EventService) {
  }
  ngOnInit() {
  	this.getEvents();

  }
   getEvents(){
  	this.eventService.getEventListing().subscribe(events => this.events = events,
  												  error => this.error = <any>error);
  }
}
