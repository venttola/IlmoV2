import { Component, OnInit, ViewChild } from '@angular/core';
import { ParticipantGroup } from "../../event-details/participantgroup.model";
import { ParticipantGroupService } from "../../event-details/participant-group.service";
import { ActivatedRoute, Params } from "@angular/router";
import { GroupModerationService } from "../group-moderation.service";
import { Member } from "../member";
import { GroupModalComponent } from "../../event-details/group-modal/group-modal.component";
import { UserPayment } from "../userpayment";

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

  @ViewChild(GroupModalComponent)
  modal: GroupModalComponent;

  constructor(private route: ActivatedRoute,
    private participantGroupService: ParticipantGroupService,
    private groupModerationService: GroupModerationService) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.participantGroupService.getGroup(+params["groupId"]))
      .subscribe((group: ParticipantGroup) => this.participantGroup = group);

    this.route.params
      .switchMap((params: Params) => this.groupModerationService.getGroupMembers(+params["groupId"]))
      .subscribe((members: Member[]) => this.members = members);
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
}
