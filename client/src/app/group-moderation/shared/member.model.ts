import { UserPayment } from "./userpayment.model";

export class Member {
  id: number;
  name: string;
  isModerator: boolean;

  payments: UserPayment[];

  static fromJSON(json: any): Member {
    let member = Object.create(Member.prototype);
    Object.assign(member, json);
    return member;
  }
}