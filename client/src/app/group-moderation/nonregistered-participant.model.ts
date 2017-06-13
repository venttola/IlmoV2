export class NonregisteredParticipant {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  allergies: string;


  static fromJSON(json: any): NonregisteredParticipant {
    let participant = Object.create(NonregisteredParticipant.prototype);
    Object.assign(participant, json);
    return participant;
  }
}