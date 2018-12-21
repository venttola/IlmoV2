//import Promise from "ts-promise";
const bankUtils = require("finnish-bank-utils");
import * as config from "config";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { UserService } from "../services/userservice";
module Service {
  export class EventService {
    constructor(private eventModel: any,
                private productModel: any,
                private discountModel: any,
                private groupPaymentModel: any,
                private participantGroupModel: any,
                private platoonModel: any,
                private userService: UserService) { }

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
    public setRegisterationFor = (eventId: number, isOpen: boolean) => {
      return new Promise((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          event.registerationOpen = isOpen;
          event.save(function (err: Error) {
            if (err) {
              let msg = ErrorHandler.getErrorMsg("Organizer", ErrorType.DATABASE_INSERTION);
               reject( new DatabaseError(500, msg));
            } else {
              resolve(event);
            }
          });
        }).catch((err: APIError) => {
          reject(err);
        });
      });
    }
    // TODO: refactor this mess
    public createParticipantGroup(eventId: number, groupData: any) {
      return new Promise((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          return this.getEventPlatoon(event, groupData.platoonId);
        }).then((platoon: any) => {
          if (platoon) {
            let createdGroup: any = {};
            this.createGroup(groupData.name, groupData.description)
            .then((group: any) => {
              createdGroup = group;
              return this.addGroupToPlatoon(platoon, group);
            })
            .then((group: any) => {
              return this.createGroupPayment();
            })
            .then((groupPayment: any) => {
              return this.setPayeeToPayment(groupPayment, createdGroup);
            })
            .then((group: any) => {
              return this.userService.getUser(groupData.moderator);
            })
            .then((user: any) => {
              createdGroup.addModerator(user, (err: Error) => {
                return err
                ? reject(new DatabaseError(500, ErrorHandler.getErrorMsg("Moderator", ErrorType.DATABASE_UPDATE)))
                : resolve(createdGroup);
              });
            })
            .catch((err: APIError) => {
            reject(err);
            });
          } else {
            reject(new DatabaseError(404, ErrorHandler.getErrorMsg("Platoon", ErrorType.NOT_FOUND)));
          }
        });
      });
    }
    public getEventDetails(eventId: number) {
      return new Promise((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          event.getPlatoons(function (err: Error, platoons: any) {
            if (err) {
              let errorMsg = ErrorHandler.getErrorMsg("Event platoon data", ErrorType.DATABASE_READ);
              reject (new DatabaseError(500, errorMsg));
            } else {
              resolve({ data: { event: event, platoons: platoons } });
            }
          });
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
     private getEventPlatoon = (event: any, platoonId: number) => {
      return new Promise((resolve, reject) => {
        event.getPlatoons((err: Error, platoons: Array<any>) => {
          if (err) {
            reject(err);
          } else {

            let platoon = this.findPlatoon(platoons, platoonId);
            resolve(platoon);
          }
        });
      });
    }

    private findPlatoon = (platoons: any[], platoonId: number) => {
      let values = platoons.filter(p => p.id === platoonId);
      let platoon = values.length > 0 ? values[0] : null;
      return platoon;
    }

    private addGroupToPlatoon = (platoon: any, group: any) => {
      return new Promise((resolve, reject) => {
        platoon.addParticipantGroups(group, (err: Error) => {
          err ? reject(err) : resolve(group);
        });
      });
    }

    private createGroup = (name: string, description: string) => {
      return new Promise((resolve, reject) => {
        this.participantGroupModel.create({
          name: name,
          description: description !== undefined ? description : ""
        }, (err: Error, group: any) => {
          err ? reject(err) : resolve(group);
        });
      });
    }

    private createGroupPayment = () => {
      return new Promise((resolve, reject) => {
        let refBase: string = config.get("ref_number_initial") + (Math.floor((Math.random() * 900) + 100)).toString();
        this.groupPaymentModel.create({
          paidOn: null,
          referenceNumber: bankUtils.generateFinnishRefNumber( refBase )
        }, (err: Error, payment: any) => {
          err ? reject(err) : resolve(payment);
        });
      });
    }

    private setPayeeToPayment = (payment: any, payee: any) => {
      return new Promise((resolve, reject) => {
        payment.setPayee(payee, function (err: Error) {
          err ? reject(err) : resolve(payee);
        });
      });
    }
  }
}

export = Service;