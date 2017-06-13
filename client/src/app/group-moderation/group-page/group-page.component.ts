import { Component, OnInit, ViewChild } from '@angular/core';
import { ParticipantGroup } from "../../event-details/participantgroup.model";
import { ParticipantGroupService } from "../../event-details/participant-group.service";
import { ActivatedRoute, Params } from "@angular/router";
import { GroupModerationService } from "../group-moderation.service";
import { Member } from "../member";
import { NonregisteredParticipant } from "../nonregistered-participant.model";
import { GroupModalComponent } from "../../event-details/group-modal/group-modal.component";
import { UserPayment } from "../userpayment";
import { Product } from "../../event-signup/product";
import { Discount } from "../../event-signup/discount";

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css', '../../styles/common-list.style.css']
})
export class GroupPageComponent implements OnInit {

  selectedMember: Member;
  selectedMemberPayments: UserPayment[];

  participantGroup: ParticipantGroup;
  members: any[] = [];

  participants: any[] = [];

  availableProducts: Product[] = [];

  newParticipant: NonregisteredParticipant;

  @ViewChild(GroupModalComponent)
  modal: GroupModalComponent;
  errorMessage: string;

  constructor(private route: ActivatedRoute,
    private participantGroupService: ParticipantGroupService,
    private groupModerationService: GroupModerationService) { 
    this.newParticipant = new NonregisteredParticipant;
    this.errorMessage = "";
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.participantGroupService.getGroup(+params["groupId"]))
      .subscribe((group: ParticipantGroup) => this.participantGroup = group);

    this.route.params
      .switchMap((params: Params) => this.groupModerationService.getGroupMembers(+params["groupId"]))
      .subscribe((members: Member[]) => this.members = members);

    this.route.params
      .switchMap((params: Params) => this.groupModerationService.getNonRegisteredParticipants(+params["groupId"]))
      .subscribe((participants: NonregisteredParticipant[]) => this.participants = participants);
    this.route.params
      .switchMap((params: Params) => this.groupModerationService.getAvailableProducts(+params["groupId"]))
      .subscribe((products: Product[]) => this.availableProducts = products);
      console.log(this.availableProducts);


  }

  onSelectMember(member: Member) {
    this.selectedMember = member;
    this.groupModerationService.getMemberPayments(this.participantGroup.id, this.selectedMember.id)
      .subscribe((userPayments: UserPayment[]) => {
        console.log(userPayments);
        this.selectedMemberPayments = userPayments;
      },
      (error: any) => console.log(error));

    this.modal.show();
  }

  onRemoveMember() {
    console.log("Removing member");

    this.groupModerationService.removeMember(this.participantGroup.id, this.selectedMember.id)
      .subscribe((members: Member[]) => {
        console.log("members: " + JSON.stringify(members));
        this.members = members;
        this.modal.hide();
      });
  }

  onReceiptPayment() {
    console.log("Updating payment status");
    this.groupModerationService.receiptPayment(this.participantGroup.id, this.selectedMember.id)
      .subscribe((userPayments: UserPayment[]) => {
        console.log(userPayments);
        this.selectedMemberPayments = userPayments;
      },
      (error: any) => console.log(error));
  }

  onAddModerator() {
    console.log("Adding moderator");
    this.groupModerationService.addModerator(this.participantGroup.id, this.selectedMember.id)
      .subscribe((members: Member[]) => {
        console.log("members: " + JSON.stringify(members));
        this.members = members;

        let selected = members.find((m: Member) => m.id === this.selectedMember.id);

        if (selected) {
          this.selectedMember = selected;
        } else {
          this.modal.hide();
          this.selectedMember = null;
        }
      });
  }

  onRemoveModerator() {
    console.log("Removing moderator");
    this.groupModerationService.removeModerator(this.participantGroup.id, this.selectedMember.id)
      .subscribe((members: Member[]) => {
        console.log("members: " + JSON.stringify(members));
        this.members = members;

        let selected = members.find((m: Member) => m.id === this.selectedMember.id);

        if (selected) {
          this.selectedMember = selected;
        } else {
          this.modal.hide();
          this.selectedMember = null;
        }
      });
  }

  onCloseModal() {
    this.modal.hide();
  }
  addParticipant(){
    console.log("Adding participant");
     let selectedProducts = this.availableProducts.filter((p: Product) => p.selected === true);

    let prodIds = selectedProducts.map((p: Product) => {
      let discounts = p.discounts.filter((d: Discount) => d.selected === true);
      let discountId: number = discounts && discounts.length > 0 ? discounts[0].id : null;

      return [p.id, discountId];
    });

    this.groupModerationService.createNonRegisteredParticipant(this.participantGroup.id, this.newParticipant, selectedProducts)
      .subscribe((res: any) => {
        console.log("User added succesfully");
      }, error => {
        this.errorMessage = "Tapahtui virhe";
      });
  }
}
