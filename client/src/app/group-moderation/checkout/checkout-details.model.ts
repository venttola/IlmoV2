import { MemberPayment } from "./member-payment.model";
import { ParticipantGroup } from "../../events/shared/participantgroup.model";

export class CheckoutDetails {
  group: ParticipantGroup;
  isPaid: boolean;
  payments: MemberPayment[];
  totalSum: number;
  refNumber: string;
  organizationBankAccount: string;
  barcode: number;

  static fromJSON(json: any): CheckoutDetails {
    let checkout = Object.create(CheckoutDetails.prototype);
    Object.assign(checkout, json);
    return checkout;
  }
}