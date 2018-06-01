import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EventsService } from "../events.service";
import { Event } from "../../../events/shared/event.model";

@Component({
  selector: 'organizer-group-listing',
  templateUrl: './group-listing.component.html',
  styleUrls: ['./group-listing.component.css','../../../styles/common-list.style.css']
})
export class GroupListingComponent implements OnInit {
  platoons$: Observable<any[]>;
  constructor(private route: ActivatedRoute,
              private eventsService: EventsService) {
  }
  ngOnInit() {
     this.platoons$ = this.route.parent.paramMap
      .switchMap((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        console.log("Getting groups");
        let organizationId = +params.get('id')
        let eventId = +params.get('eventId')
        return this.eventsService.getGroupListing(organizationId, eventId);
      });
      this.platoons$.subscribe(platoons =>{
        console.log(platoons);
      });
  }

}
