import { ParticipantGroup } from "../event-details/participantgroup.model";
import { Product } from "./product.model";
export class SignupData {
  signedUp: boolean;
  group: ParticipantGroup;
  eventProducts: Product[];
  isRegistrationOpen: boolean;

  static fromJSON(json: any): SignupData {
    let data = Object.create(SignupData.prototype);
    Object.assign(data, json);
    return data;
  }
}