import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";

import { GroupModalComponent } from "../../shared/group-modal/group-modal.component";

import { GroupModerationService } from "../shared/group-moderation.service";
import { ParticipantGroupService } from "../../events/event-details/participant-group.service";

import { ParticipantGroup } from "../../events/shared/participantgroup.model";
import { Member } from "../shared/member.model";
import { Participant } from "../shared/participant.model";
import { Payment } from "../shared/payment.model";
import { Product } from "../../events/shared/product.model";
import { Discount } from "../../events/shared/discount.model";

@Component({
  selector: 'group-moderation-group-signups',
  templateUrl: './group-signups.component.html',
  styleUrls: ['./group-signups.component.css', '../../styles/common-list.style.css']
})
export class GroupSignupsComponent implements OnInit {

  selectedMember: Member;
  selectedMemberPayments: Payment[];

  participantGroup: ParticipantGroup;
  members: Member[] = [];

  participants: Participant[] = [];

  selectedParticipant: Participant;
  selectedParticipantPayments: Payment[];

  @ViewChild('memberModal')
  memberModal: GroupModalComponent;

  @ViewChild('participantModal')
  participantModal: GroupModalComponent;

  allMarked: boolean;

  errorMessage: string;
  infoMessage: string;

  constructor(private route: ActivatedRoute,
    private participantGroupService: ParticipantGroupService,
    private groupModerationService: GroupModerationService) {
    this.errorMessage = "";
    this.infoMessage = "";
  }

  ngOnInit() {
    this.route.parent.params
      .switchMap((params: Params) => this.participantGroupService.getGroup(+params["groupId"]))
      .subscribe((group: ParticipantGroup) => this.participantGroup = group);

    this.getMembers();
    this.getParticipants();
  }

  onSelectMember(member: Member) {
    this.selectedMember = member;
    this.groupModerationService.getMemberPayments(this.participantGroup.id, this.selectedMember.id)
      .subscribe((userPayments: Payment[]) => {
        //console.log(userPayments);
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
      .subscribe((userPayments: Payment[]) => {
        console.log(userPayments);
        this.selectedMemberPayments = userPayments;
      },
      (error: any) => console.log(error));
  }

  onReceiptParticipantPayment() {
    this.groupModerationService.receiptParticipantPayment(this.participantGroup.id, this.selectedParticipant.id)
      .subscribe((userPayments: Payment[]) => {
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

  getMembers() {
    this.route.parent.params
      .switchMap((params: Params) => this.groupModerationService.getGroupMembers(+params["groupId"]))
      .subscribe((members: Member[]) => {
        this.members = members;
        this.members.map((m: Member) => {
          this.groupModerationService.getMemberPayments(this.participantGroup.id, m.id)
          .subscribe((memberPayments: Payment[]) => {
            //console.log(memberPayments);
            m.payments = memberPayments;
          },
            (error: any) => console.log(error));

        });
      });
  }

  getParticipants() {
    this.route.parent.params
      .switchMap((params: Params) => this.groupModerationService.getParticipants(+params["groupId"]))
      .subscribe((participants: Participant[]) => {
        this.participants = participants;
        this.participants.map((p: Participant) => {
          this.groupModerationService.getParticipantPayments(this.participantGroup.id, p.id)
            .subscribe((participantPayments: Payment[]) => {
              //console.log(participantPayments);
              p.payments = participantPayments;
          },
          (error: any) => console.log(error));

        });
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
      .subscribe((participantPayments: Payment[]) => {
        //console.log(participantPayments);
        this.selectedParticipantPayments = participantPayments;
        this.participantModal.show();
      },
      (error: any) => console.log(error));

  }
  markAll() {
    this.members.map(m => {
      m.payments.map( p => {
        p.isPaid ? [] : p.marked = true;
      })
    });
     this.participants.map(p => {
      p.payments.map( p => {
        p.isPaid ? [] : p.marked = true;
      })
    });
    this.allMarked = true;
  }
  cleanAllMarks() {
    this.members.map(m => {
      m.payments.map( p => {
        p.isPaid ? [] : p.marked = false;
      })
    });
     this.participants.map(p => {
      p.payments.map( p => {
        p.isPaid ? [] : p.marked = false;
      })
    });
    this.allMarked = false;
  }
  receiptBatch(){
    console.log("Receipt multiple");
    let markedMembers = this.members.filter(m => {
       let marked = m.payments.filter(p => p.marked && !p.isPaid);
       return marked.length > 0;
    });
    let markedParticipants = this.participants.filter(p => {
      let marked = p.payments.filter(p => p.marked && !p.isPaid);
       return marked.length > 0;
    });
    markedMembers.map(m => {
      console.log(m.name);
      this.groupModerationService.receiptPayment(this.participantGroup.id, m.id).subscribe((userPayments: Payment[]) => {
        m.payments = userPayments;
      },
      (error: any) => console.log(error));

    });
    markedParticipants.map(p => {
      console.log(p.firstname + p.lastname)
      this.groupModerationService.receiptParticipantPayment(this.participantGroup.id, p.id).subscribe((participantPayments: Payment[]) => {
        p.payments = participantPayments;
      },
      (error: any) => console.log(error));
    });
  }

}
