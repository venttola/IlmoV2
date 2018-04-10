import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GroupModerationService } from "../shared/group-moderation.service";

import { GroupCheckoutDetails } from "./group-checkout-details";
import { ParticipantGroupService } from "../../events/event-details/participant-group.service";
import { ParticipantGroup } from "../../events/shared/participantgroup.model";


@Component({
  selector: 'app-group-checkout-page',
  templateUrl: './group-checkout-page.component.html',
  styleUrls: ['./group-checkout-page.component.css']
})
export class GroupCheckoutPageComponent implements OnInit {
  checkoutDetails: GroupCheckoutDetails;

  constructor(private route: ActivatedRoute,
    private groupModerationService: GroupModerationService) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.groupModerationService.getGroupCheckoutDetails(+params["groupId"]))
      .subscribe((checkoutDetails: GroupCheckoutDetails) => {
        console.log(JSON.stringify(checkoutDetails));
        this.checkoutDetails = checkoutDetails;
      });
  }

  onReceiptGroupPayment() {
    this.groupModerationService.receiptGroupPayment(this.checkoutDetails.group.id)
      .subscribe((checkoutDetails: GroupCheckoutDetails) => {
        console.log(JSON.stringify(checkoutDetails));
        this.checkoutDetails = checkoutDetails;
      });
  }
}
