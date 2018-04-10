export class MemberPayment {
  name: string;
  productSum: number;
  discountSum: number;

  static fromJSON(json: any): MemberPayment {
    let memberPayment = Object.create(MemberPayment.prototype);
    Object.assign(memberPayment, json);
    return memberPayment;
  }
}
