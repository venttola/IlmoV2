import { Component, OnInit } from '@angular/core';

import { GroupModerationService } from "../shared/group-moderation.service";

import { ParticipantGroup } from "../../events/shared/participantgroup.model";

@Component({
  selector: 'app-group-moderation',
  templateUrl: './group-moderation.component.html',
  styleUrls: ['./group-moderation.component.css', '../styles/common-list.style.css']
})
export class GroupListingComponent implements OnInit {

  moderatedGroups: ParticipantGroup[] = [];

  constructor(private groupModerationService: GroupModerationService) { }

  ngOnInit() {
    this.groupModerationService.getModeratedGroups().subscribe(groups => this.moderatedGroups = groups);
  }

}
