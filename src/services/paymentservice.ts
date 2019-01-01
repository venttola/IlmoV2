import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
  export class PaymentService {
    constructor(
      private productModel: any,
      private discountModel: any,
      private productSelectionModel: any,
      private participantModel: any,
      private participantPaymentModel: any,
      ) { }

  }
}
export = Service;