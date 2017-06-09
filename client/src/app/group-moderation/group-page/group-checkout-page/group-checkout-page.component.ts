import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GroupModerationService } from "../../group-moderation.service";
import { ParticipantGroupService } from "../../../event-details/participant-group.service";
import { ParticipantGroup } from "../../../event-details/participantgroup.model";

@Component({
  selector: 'app-group-checkout-page',
  templateUrl: './group-checkout-page.component.html',
  styleUrls: ['./group-checkout-page.component.css']
})
export class GroupCheckoutPageComponent implements OnInit {
  participantGroup: ParticipantGroup;

  constructor(private route: ActivatedRoute,
    private groupModerationService: GroupModerationService,
    private participantGroupService: ParticipantGroupService) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.participantGroupService.getGroup(+params["groupId"]))
      .subscribe((group: ParticipantGroup) => this.participantGroup = group);
  }

}
