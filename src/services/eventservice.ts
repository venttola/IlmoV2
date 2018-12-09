//import Promise from "ts-promise";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
  export class EventService {
    constructor(private eventModel: any,
                private productModel: any,
                private discountModel: any) { }

    public getEventProducts = (eventId: number) => {
      return new Promise((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          event.getProducts(function (err: Error, prods: any) {
            if (err) {
              let errorMsg = ErrorHandler.getErrorMsg("Event product data", ErrorType.DATABASE_READ);
              reject(new DatabaseError(500, errorMsg));
            } else {
              resolve(prods);
            }
          });
        }).catch((err: APIError) => {
          reject(err);
        });
      });
    };

    public isEventRegistrationOpen = (eventId: number) => {
      return new Promise((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          resolve(event.registerationOpen);
        });
      });
    }

    public getEvent = (eventId: number) => {
      return new Promise((resolve, reject) => {
        this.eventModel.one({ id: eventId }, function (err: Error, event: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_READ);
            reject(new DatabaseError(500, errorMsg));
          } else if (!event) {
            let errorMsg = ErrorHandler.getErrorMsg("Event", ErrorType.NOT_FOUND);
            reject(new DatabaseError(404, errorMsg));
          } else {
            resolve(event);
          }
        });
      });
    }
    public getAllEvents = () => {
      return new Promise ((resolve, reject) => {
        this.eventModel.all(function (err: Error, events: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_READ);
            reject (new DatabaseError(500, errorMsg));
          } else {
            resolve(events);
          }
        });
      });
    }
    // TODO: Implement Platoon, group and participant removal.
    public removeEvent = (eventId: number ) => {
      return new Promise ((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          event.remove(function (err: Error) {
            if (err) {
              let msg = ErrorHandler.getErrorMsg("Event", ErrorType.DATABASE_DELETE);
              reject(new DatabaseError(500, msg));
            } else {
              resolve(event);
            }
          });
        }).catch((err: DatabaseError) => {
          reject(err);
        });
      });
    }
    public createEvent = (name: string,
      startDate: string,
      endDate: string,
      description: string,
      registerationOpen: boolean) => {
      return new Promise((resolve, reject) => {
        this.eventModel.create({
          name: name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          description: description,
          registerationOpen: registerationOpen
        }, function (err: Error, event: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_INSERTION);
            return reject(new DatabaseError(500, errorMsg));
          } else {
            return resolve(event);
          }
        });
      });
    }
    public addProductFor = (eventId: number,
                            productData: any) => {
      return new Promise((resolve, reject) => {
        let self = this;
        this.getEvent(eventId)
        .then( (event: any) => {
          this.productModel.create({
              name: productData.name,
              price: productData.price
            }, function (err: Error, prod: any) {
              if (err) {
                let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_INSERTION);
                reject( new DatabaseError(500, errorMsg));
              } else {
                event.addProducts(prod, function (err: Error) {
                  if (err) {
                    reject( new DatabaseError(500, "ERROR: Adding product to event failed"));
                  } else {
                    let discountPromises: any = productData.discounts.map((discount: any) => {
                      return self.createDiscount(prod, discount);
                    });
                    Promise.all(discountPromises).then((promises: any) => {
                      resolve (prod);
                    }).catch((err: APIError) => {
                      reject (err);
                    });
                  }
                });
              }
            });
        }).catch((err: APIError) => {
          reject(err);
        });
    });
    }
    public updateProduct = (productId: number,
                            productData: any) => {
      return new Promise((resolve, reject) => {
        let self = this;
        this.productModel.one({
          id: productId,
        }, function (err: Error, product: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_INSERTION);
            reject( new DatabaseError(500, errorMsg));
          } else {
            product.name = productData.name;
            product.price = productData.price;
            product.save(function(err: any) {
              if (err) {
                let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_INSERTION);
                reject( new DatabaseError(500, errorMsg));
              } else {
                let discountPromises: any = productData.discounts.map((discount: any) => {
                  if (!discount.id) {
                    return self.createDiscount(product, discount);
                  } else {
                    return self.updateDiscount(discount);
                  }
                });
                Promise.all(discountPromises).then((promises: any) => {
                  resolve(product);
                }).catch((err: APIError) => {
                  reject( err );
                });
              }
            });
          }
        });
      });
    }
    private createDiscount = (product: any, discount: any) => {
      return new Promise((resolve, reject) => {
        this.discountModel.create({
          name: discount.name,
          amount: discount.amount
        }, function (err: Error, discount: any) {
          if (err || !discount) {
            let errorMsg = ErrorHandler.getErrorMsg("Discount", ErrorType.DATABASE_INSERTION);
            reject(new DatabaseError(500, errorMsg));
          } else {
            discount.setProduct(product, function (err: Error) {
              if (err) {
                let msg = ErrorHandler.getErrorMsg("Discount", ErrorType.DATABASE_INSERTION);
                return reject(new DatabaseError(500, msg));
              } else {
                console.log(JSON.stringify(product));
                return resolve(discount);
              }
            });
          }
        });
      });
    }
    private updateDiscount = (newDiscount: any) => {
      return new Promise((resolve, reject) => {
        this.discountModel.find({
          id: newDiscount.id
        }, function (err: Error, discount: any) {
          if (err || !discount) {
            let errorMsg = ErrorHandler.getErrorMsg("Discount", ErrorType.DATABASE_INSERTION);
            reject(new DatabaseError(500, errorMsg));
          } else {
            resolve(discount);
          }
        });
      });
    }
  }
}

export = Service;