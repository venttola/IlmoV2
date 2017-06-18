import { MemberPayment } from "./member-payment";
import { ParticipantGroup } from "../../../event-details/participantgroup.model";

export class GroupCheckoutDetails {
  group: ParticipantGroup;
  isPaid: boolean;
  payments: MemberPayment[];
  totalSum: number;
  refNumber: string;
  organizationBankAccount: string;

  static fromJSON(json: any): GroupCheckoutDetails {
    let checkout = Object.create(GroupCheckoutDetails.prototype);
    Object.assign(checkout, json);
    return checkout;
  }
}