import { Component, OnInit } from '@angular/core';
import { ParticipantGroup } from "../event-details/participantgroup.model";
import { GroupModerationService } from "./group-moderation.service";

@Component({
  selector: 'app-group-moderation',
  templateUrl: './group-moderation.component.html',
  styleUrls: ['./group-moderation.component.css']
})
export class GroupModerationComponent implements OnInit {

  moderatedGroups: ParticipantGroup[] = [];

  constructor(private groupModerationService: GroupModerationService) { }

  ngOnInit() {
    this.groupModerationService.getModeratedGroups().subscribe(groups => this.moderatedGroups = groups);
  }

}
