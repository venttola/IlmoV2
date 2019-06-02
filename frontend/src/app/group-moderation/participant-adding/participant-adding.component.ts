import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";

import { GroupModerationService } from "../shared/group-moderation.service";
import { ParticipantGroupService } from "../../events/event-details/participant-group.service";

import { Discount } from "../../events/shared/discount.model";
import { ParticipantGroup } from "../../events/shared/participantgroup.model";
import { Participant } from "../shared/participant.model";
import { Product } from "../../events/shared/product.model";
import { Payment } from "../shared/payment.model";
@Component({
  selector: 'group-moderation-participant-adding',
  templateUrl: './participant-adding.component.html',
  styleUrls: ['./participant-adding.component.css']
})
export class ParticipantAddingComponent implements OnInit {
  availableProducts: Product[] = [];
  selectedProducts: Product[] = [];

  newParticipant: Participant;
  participantGroup: ParticipantGroup;
  infoMessage: string;
  errorMessage: string;
  constructor(private route: ActivatedRoute,
    private participantGroupService: ParticipantGroupService,
    private groupModerationService: GroupModerationService) { 
    this.newParticipant = new Participant;
  }

  ngOnInit() {
  	 this.route.parent.params
      .switchMap((params: Params) => this.participantGroupService.getGroup(+params["groupId"]))
      .subscribe((group: ParticipantGroup) => this.participantGroup = group);

  	this.route.parent.params
      .switchMap((params: Params) => this.groupModerationService.getAvailableProducts(+params["groupId"]))
      .subscribe((products: Product[]) => this.availableProducts = products);
  }
  addParticipant() {
    this.infoMessage = "";
    this.errorMessage = "";
    let selectedProducts = this.availableProducts.filter((p: Product) => p.selected === true);

    let prodIds = selectedProducts.map((p: Product) => {
      let discounts = p.discounts.filter((d: Discount) => d.selected === true);
      let discountId: number = discounts && discounts.length > 0 ? discounts[0].id : null;

      return [p.id, discountId];
    });

    this.groupModerationService.createParticipant(this.participantGroup.id, this.newParticipant, selectedProducts)
      .subscribe((participant: any) => {
        this.infoMessage = "Osallistuja " + participant.firstname + " " + participant.lastname + " lisätty onnistuneesti";
      }, error => {
        this.errorMessage = "Tapahtui virhe";
      });
  }
  selectProduct(productId: number) {
    let prods = this.availableProducts
      .filter((p: Product) => p.id == productId);
    prods.map((p: Product) => p.selected = true);
    this.selectedProducts = this.selectedProducts.concat(prods);
  }
  deselectProduct(productId: number) {
    this.selectedProducts = this.selectedProducts.filter((p: Product) => p.id != productId);
  }

}
