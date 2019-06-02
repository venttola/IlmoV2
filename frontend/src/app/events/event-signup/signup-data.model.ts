import { ParticipantGroup } from "../shared/participantgroup.model";
import { Product } from "../shared/product.model";
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