import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { mergeMap } from "rxjs/operators";
import { GroupModerationService } from "../shared/group-moderation.service";

import { Event } from "../../events/shared/event.model";
import { ParticipantGroup } from "../../events/shared/participantgroup.model";

@Component({
  selector: 'group-moderation-group-listing',
  templateUrl: './group-listing.component.html',
  styleUrls: ['./group-listing.component.css', '../../styles/common-list.style.css']
})
export class GroupListingComponent implements OnInit {

  moderatedGroups: Observable<ParticipantGroup[]>;
  events: Map <number,Event> = new Map <number,Event>();


  constructor(private groupModerationService: GroupModerationService) { }

  ngOnInit() {
    
    this.moderatedGroups = this.groupModerationService.getModeratedGroups();
    this.moderatedGroups.subscribe(groups => {
          groups.map(group =>
            this.groupModerationService.getGroupEvent(group.id).subscribe(event => {
              group.eventId = event.id;
              this.events[group.id] = event;
            })
          );
    });
  }
  getGroupEvent(group: ParticipantGroup): Event {
    return this.events[group.id];
  }

}
