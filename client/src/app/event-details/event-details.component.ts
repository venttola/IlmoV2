import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { EventDetailsService } from "./event-details.service";
import { EventDetails } from "./event-details.model";

import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventDetails: EventDetails;
  error: any;
  constructor(private route: ActivatedRoute,
  			  private eventDetailsService: EventDetailsService) {

  }
  ngOnInit() {
  	this.route.params.switchMap((params: Params) =>

  	this.eventDetailsService.getEventDetails(+params["id"])).subscribe((eventDetails: EventDetails) => this.eventDetails = eventDetails,
  												  error => this.error = <any>error);
  }

}
