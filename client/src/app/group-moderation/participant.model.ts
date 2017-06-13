export class Participant {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  allergies: string;


  static fromJSON(json: any): Participant {
    let participant = Object.create(Participant.prototype);
    Object.assign(participant, json);
    return participant;
  }
}