import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GroupModerationService } from "../shared/group-moderation.service";

import { CheckoutDetails } from "./checkout-details.model";
import { ParticipantGroupService } from "../../events/event-details/participant-group.service";
import { ParticipantGroup } from "../../events/shared/participantgroup.model";


@Component({
  selector: 'group-moderation-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutDetails: CheckoutDetails;

  constructor(private route: ActivatedRoute,
    private groupModerationService: GroupModerationService) { }

  ngOnInit() {
    this.route.parent.params
      .switchMap((params: Params) => this.groupModerationService.getGroupCheckoutDetails(+params["groupId"]))
      .subscribe((checkoutDetails: CheckoutDetails) => {
        console.log(JSON.stringify(checkoutDetails));
        this.checkoutDetails = checkoutDetails;
      });
  }

  onReceiptGroupPayment() {
    this.groupModerationService.receiptGroupPayment(this.checkoutDetails.group.id)
      .subscribe((checkoutDetails: CheckoutDetails) => {
        console.log(JSON.stringify(checkoutDetails));
        this.checkoutDetails = checkoutDetails;
      });
  }
}
