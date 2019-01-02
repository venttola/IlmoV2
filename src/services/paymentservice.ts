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
    //TODO: Needs refactoring
    public addPaymentProducts = async (payment: any, productIds: any[], discountIds: number[]) => {
      let selectionPromises: any = [];
      let products = await this.getProductsByIds(productIds);
      products.forEach((p: any) => {
        selectionPromises.push(new Promise((resolve, reject) => {
          this.productSelectionModel.create({}, function (err: Error, ps: any) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              ps.setProduct(p, function (err: Error) {
                let disc = p.discounts.find((d: any) => discountIds.some((di: any) => di === d.id));
                if (disc) {
                  ps.setDiscount(disc, (err: Error) =>
                    err ? reject(err)
                    : payment.addProductSelections(ps, (err: Error) =>
                      err ? reject(err)
                      : resolve(true)));
                } else {
                  payment.addProductSelections(ps, (err: Error) => err ? reject(err) : resolve(true));
                }
              });
            }
          });
        }));
      });
      return Promise.all(selectionPromises);
    }
    public getProductsByIds = async (products: Number[]): Promise<any[]> => {
      return new Promise<any[]>((resolve, reject) => {
        this.productModel.find({ id: products }, function (err: Error, products: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_READ);
            reject(new DatabaseError(500, errorMsg));
          } else if (!products) {
            let errorMsg = ErrorHandler.getErrorMsg("Product", ErrorType.NOT_FOUND);
            reject(new DatabaseError(404, errorMsg));
          } else {
            resolve(products);
          }
        });
      });
    }
  }
}
export = Service;