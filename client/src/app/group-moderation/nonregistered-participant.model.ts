export class NonregisteredParticipant {
  id: number;
  name: string;

  static fromJSON(json: any): NonregisteredParticipant {
    let participant = Object.create(NonregisteredParticipant.prototype);
    Object.assign(participant, json);
    return participant;
  }
}