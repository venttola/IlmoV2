export class Member {
  id: number;
  name: string;

  static fromJSON(json: any): Member {
    let member = Object.create(Member.prototype);
    Object.assign(member, json);
    return member;
  }
}