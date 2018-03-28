import { Component, OnInit, ViewChild } from '@angular/core';
import { ParticipantGroup } from "../../events/shared/participantgroup.model";
import { ParticipantGroupService } from "../../events/event-details/participant-group.service";
import { ActivatedRoute, Params } from "@angular/router";
import { GroupModerationService } from "../group-moderation.service";
import { Member } from "../member";
import { Participant } from "../participant.model";
import { UserPayment } from "../userpayment";
import { Product } from "../../events/shared/product.model";
import { Discount } from "../../events/shared/discount.model";
//a temporary crutch before groups are wrapped into a module
//import G
import { GroupModalComponent } from "../../shared/group-modal/group-modal.component";

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

  newParticipant: Participant;

  selectedParticipant: Participant;
  selectedParticipantPayments: UserPayment[];

  @ViewChild('memberModal')
  memberModal: GroupModalComponent;

  @ViewChild('participantModal')
  participantModal: GroupModalComponent;

  errorMessage: string;
  infoMessage: string;

  constructor(private route: ActivatedRoute,
    private participantGroupService: ParticipantGroupService,
    private groupModerationService: GroupModerationService) {
    this.newParticipant = new Participant;
    this.errorMessage = "";
    this.infoMessage = "";
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.participantGroupService.getGroup(+params["groupId"]))
      .subscribe((group: ParticipantGroup) => this.participantGroup = group);

    this.route.params
      .switchMap((params: Params) => this.groupModerationService.getGroupMembers(+params["groupId"]))
      .subscribe((members: Member[]) => this.members = members);

    this.getParticipants();
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

    this.memberModal.show();
  }

  onRemoveMember() {
    console.log("Removing member");

    this.groupModerationService.removeMember(this.participantGroup.id, this.selectedMember.id)
      .subscribe((members: Member[]) => {
        console.log("members: " + JSON.stringify(members));
        this.members = members;
        this.memberModal.hide();
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

  onReceiptParticipantPayment() {
    this.groupModerationService.receiptParticipantPayment(this.participantGroup.id, this.selectedParticipant.id)
      .subscribe((userPayments: UserPayment[]) => {
        console.log(userPayments);
        this.selectedParticipantPayments = userPayments;
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
          this.memberModal.hide();
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
          this.memberModal.hide();
          this.selectedMember = null;
        }
      });
  }

  onCloseMemberModal() {
    this.memberModal.hide();
  }
  onCloseParticipantModal() {
    this.participantModal.hide();
  }

  getParticipants() {
    this.route.params
      .switchMap((params: Params) => this.groupModerationService.getParticipants(+params["groupId"]))
      .subscribe((participants: Participant[]) => this.participants = participants);
  }

  addParticipant() {
    this.infoMessage = "";
    this.errorMessage = "";
    console.log("Adding participant");
    let selectedProducts = this.availableProducts.filter((p: Product) => p.selected === true);

    let prodIds = selectedProducts.map((p: Product) => {
      let discounts = p.discounts.filter((d: Discount) => d.selected === true);
      let discountId: number = discounts && discounts.length > 0 ? discounts[0].id : null;

      return [p.id, discountId];
    });

    this.groupModerationService.createParticipant(this.participantGroup.id, this.newParticipant, selectedProducts)
      .subscribe((participant: any) => {
        console.log("Participant added succesfully");
        this.getParticipants();
        this.infoMessage = "Osallistuja " + participant.firstname + " " + participant.lastname + " lisätty onnistuneesti";
      }, error => {
        this.errorMessage = "Tapahtui virhe";
      });
  }
  removeParticipant() {
    console.log("Removing participant");
    this.groupModerationService.removeParticipant(this.participantGroup.id, this.selectedParticipant.id).
      subscribe((participants: Participant[]) => {
        this.infoMessage = "Osallistuja " + this.selectedParticipant.firstname + " " + this.selectedParticipant.lastname + " poistettu onnistuneesti";
        this.participants = participants;
        this.participantModal.hide();
      });
  }
  onSelectParticipant(participant: Participant) {
    this.selectedParticipant = participant;
    this.groupModerationService.getParticipantPayments(this.participantGroup.id, this.selectedParticipant.id)
      .subscribe((participantPayments: UserPayment[]) => {
        console.log(participantPayments);
        this.selectedParticipantPayments = participantPayments;
        this.participantModal.show();
      },
      (error: any) => console.log(error));

  }

}
