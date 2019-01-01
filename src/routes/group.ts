import * as express from "express";
//import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { GroupService } from "../services/groupservice";
import { reduce } from "underscore";
var bankUtils = require("finnish-bank-utils");
var dateFormat = require("dateformat");

module Route {
  class DiscountInfo {
    id: number;
    name: string;
    amount: number;

    constructor(id: number, name: string, amount: number) {
      this.id = id;
      this.name = name;
      this.amount = amount;
    }
  }

  class ProductInfo {
    id: number;
    name: string;
    price: number;

    constructor(id: number, name: string, price: number) {
      this.id = id;
      this.name = name;
      this.price = price;
    }
  }

  class ProductSelectionInfo {
    product: ProductInfo;
    discount: DiscountInfo;

    constructor(prodInfo: ProductInfo, discInfo: DiscountInfo) {
      this.product = prodInfo;
      this.discount = discInfo;
    }
  }

  class PaymentInfo {
    id: number;
    products: ProductSelectionInfo[];
    isPaid: boolean;
    paidOn: Date;

    constructor(id: number, prods: ProductSelectionInfo[], isPaid: boolean, paidOn: Date) {
      this.id = id;
      this.products = prods;
      this.isPaid = isPaid;
      this.paidOn = paidOn;
    }
  }

  export class GroupRoutes {
    constructor(private groupModel: any,
      private productModel: any,
      private discountModel: any,
      private participantModel: any,
      private participantPaymentModel: any,
      private productSelectionModel: any,
      private groupPaymentModel: any,
      private userService: UserService,
      private groupService: GroupService) {

    }
    /**
    * @api {get} api/group/:group Get group info
    * @apiName getParticipantGroup
    * @apiGroup Group
    * @apiParam {Number} group Group's id
    * @apiSuccess (200) group Group info
    * @apiError (500) DatabaseReadError ERROR: Group data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: Group was not found
    */
    public getParticipantGroup = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;

      this.groupService.getGroup(groupId).then((group: any) => {
        group.groupPayment = undefined;
        return res.status(200).json(group);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }

    /**
    * @api {delete} api/group/:group/:username Remove a group member
    * @apiName removeMember
    * @apiGroup Group
    * @apiParam {Number} group Group unique id
    * @apiParam {String} username Username (email)
    * @apiSuccess (200) members list of members after deletion
    * @apiError (500)  DatabaseReadError ERROR: Group data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: Group was not found
    * @apiError (500) DatabaseReadError ERROR: User data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: User was not found
    * @apiError (500) DatabaseDeleteError ERROR: Member deletion failed
    */
    public removeMember = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;
      let memberId: number = +req.params.member;

      this.groupService.removeMember(groupId, memberId)
      .then((currentMembers: any[]) => {
        return res.status(200).json(currentMembers);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }

    /**
    * @api {patch} api/group/:group/moderator  Add a group moderation rights
    * @apiName addModerator
    * @apiGroup Group
    * @apiParam {Number} group Group unique id
    * @apiParam {JSON} memberId Member id
    * @apiSuccess (204) -
    * @apiError DatabaseReadError ERROR: Group data could not be read from the database
    * @apiError DatabaseReadError ERROR: Group was not found
    * @apiError DatabaseReadError ERROR: User data could not be read from the database
    * @apiError DatabaseReadError ERROR: User was not found
    * @apiError DatabaseUpdateError ERROR: Moderator insertion failed
    */
    public addModerator = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;
      let memberId = req.body.memberId;
      let self = this;
      this.groupService.addModerator(groupId, memberId)
      .then((members: any) => {
        res.status(200).json(members);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }

    /**
    * @api {delete} api/group/:group/:username/moderator Remove a group moderation rights
    * @apiName removeModerator
    * @apiGroup Group
    * @apiParam {Number} groupId Group unique id
    * @apiParam {String} username Username (email)
    * @apiSuccess (200) -
    * @apiError (500) DatabaseReadError ERROR: Group data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: Group was not found
    * @apiError (500) DatabaseReadError ERROR: User data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: User was not found
    * @apiError (500) DatabaseUpdateError ERROR: Moderator deletion failed
    */
    public removeModerator = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;
      let memberId = req.params.member;
      let self = this;

      this.groupService.removeModerator(groupId, memberId).then((members: any) => {
        return res.status(200).json(members);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    /**
    * @api {post} api/group/:group/moderator/userpayment Mark a user payment as paid
    * @apiName receiptPayment
    * @apiGroup Group
    * @apiParam {Number} groupId Group's unique id
    * @apiParam {Number} memberId Member user's unique id
    * @apiSuccess (200) payments Payments which the user has 
    * @apiError (500) DatabaseReadError ERROR: Group data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: Group was not found
    * @apiError (500) DatabaseReadError ERROR: User data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: User was not found
    * @apiError (500) DatabaseUpdateError ERROR: Payment reciping failed
    */
    public receiptPayment = (req: express.Request, res: express.Response) => {
      console.log("Receipting Payment");
      this.groupService.receiptMemberPayment(req.body.groupId, req.body.memberId)
      .then((paidPayments: any) => {
        return this.groupService.getPaymentProducts(paidPayments);
      }).then((payments: any) => {
        return res.status(200).json(this.mapPaymentProducts(payments));
      });
    }
    /**
    * @api {post} api/group/:group/moderator/participantpayment Mark a participant payment as paid
    * @apiName receiptParticipantPayment
    * @apiGroup Group
    * @apiParam {Number} groupId Group's unique id
    * @apiParam {Number} participantId Participant's unique id
    * @apiSuccess (200) payments Payments which the participant has 
    * @apiError (500) DatabaseReadError ERROR: Group data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: Group was not found
    * @apiError (500) DatabaseReadError ERROR: Participant data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: Participant was not found
    * @apiError (500) DatabaseUpdateError ERROR: Payment reciping failed
    */
    public receiptParticipantPayment = (req: express.Request, res: express.Response) => {
      console.log("Receipting Participant Payment");
      this.groupService.receiptParticipantPayment(req.body.groupId, req.body.participantId)
      .then((paidPayments: any) => {
        return this.groupService.getPaymentProducts(paidPayments);
      }).then((payments: any) => {
        return res.status(200).json(this.mapPaymentProducts(payments));
      });
    }
    /**
    * @api {get} api/group/:username/moderation Get groups moderated by user
    * @apiName getModeratedGroups
    * @apiGroup Group
    * @apiParam {String} username user's username
    * @apiSuccess (200) groups groups moderated by the user
    * @apiError (404) DatabaseReadError ERROR: User not found
    * @apiError (500) DatabaseReadError ERROR: Could not read moderation data
    */
    public getModeratedGroups = (req: express.Request, res: express.Response) => {
      let username = req.params.username;

      this.userService.getUser(username).then((user: any) => {
        user.getModeratedGroups((err: Error, groups: any) => {
          if (err) {
            let msg = ErrorHandler.getErrorMsg("Moderated groups", null);
            return res.status(500).send(msg);
          }
          return res.status(200).json(groups);
        });
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    /**
    * @api {get} api/group/:group/event Get event associated with the group
    * @apiName getGroupEvent
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiSuccess (200) event Event associated with the group
    * @apiError (404) DatabaseReadError ERROR: Group not found
    * @apiError (500) DatabaseReadError ERROR: Could not read data
    */
    public getGroupEvent = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;
      this.groupService.getGroupEvent(groupId).then((event: any) =>
        res.status(200).json(event))
      .catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
     }
    /**
    * @api {get} api/group/:group/moderator/members Get list of group members
    * @apiName getGroupMembers
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiSuccess (200) members List of group members
    * @apiError (404) DatabaseReadError ERROR: Group not found
    * @apiError (500) DatabaseReadError ERROR: Could not read data
    */
    public getGroupMembers = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;

      this.groupService.getMemberInfo(groupId).then((memberInfos: any) =>
        res.status(200).json(memberInfos))
      .catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    /**
    * @api {get} api/group/:group/moderator/userpayment/:member Get list of member's payments associated with the group
    * @apiName getMemberPayments
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiParam {Number} member Member's unique id
    * @apiSuccess (200) payments List of users's payments
    * @apiError (404) DatabaseReadError ERROR: Group not found
    * @apiError (500) DatabaseReadError ERROR: Could not read data
    */
    // TODO: Error checking
    public getMemberPayments = (req: express.Request, res: express.Response) => {
      let groupId: number = +req.params.group;
      let memberId: number = +req.params.member;

      this.groupService.filterUserPaymentsForGroup(memberId, groupId)
      .then(this.groupService.getPaymentProducts)
      .then((finalPayments: any[]) => {
        return res.status(200).json(this.mapPaymentProducts(finalPayments));
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    /**
    * @api {get} api/group/:group/checkout Get checkout data for group's payments
    * @apiName getGroupCheckout
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiSuccess (200) checkout Checkout data for the group
    * @apiError (500) DatabaseUpdateError ERROR: Internal error
    */
    public getGroupCheckout = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;

      this.groupService.getParticipantGroupCheckout(groupId)
      .then((checkout: any) => {
        return res.status(200).json(checkout);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    /**
    * @api {post} api/group/:group/receipt Mark the group's payment as paid
    * @apiName receiptGroupPayment
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiSuccess (200) checkout Checkout data for the payment marked as paid
    * @apiError (500) DatabaseUpdateError ERROR: Internal error
    */
    public receiptGroupPayment = (req: any, res: express.Response) => {
      let groupId = req.params.group;
      this.groupService.receiptGroupPayment(groupId)
      .then((groupPayment: any) => {
        return this.groupService.getParticipantGroupCheckout(groupId);
      }).then((checkout: any) => {
        return res.status(200).json(checkout);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    //TODO: This is a middleware function, move this out of this class.
    public checkModerator = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let groupId = req.params.group;
      let username = req.user.email;

      Promise.all([this.userService.getUser(username), this.groupService.getGroup(groupId)]).then((results: any) => {
        let user = results[0];
        let group = results[1];

        group.hasModerator(user, (err: Error, isModerator: boolean) => {
          if (err) {
            let msg = ErrorHandler.getErrorMsg("Moderation status", ErrorType.DATABASE_READ);
            return res.status(500).send(msg);
          } else if (!isModerator) {
            return res.status(403).send("You are not a moderator of this group");
          } else {
            next();
          }
        });
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    /**
    * @api api/group/:group/moderator/participants Creates a new participant and adds it to a group
    * @apiName addParticipant
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiParam {json} participant Participant's info
    * @apiParam {json[]} products List containing info about the products for the participant
    * @apiSuccess (200) participant The created participant
    * @apiError (404) DatabaseReadError ERROR: Group not found
    * @apiError (500) DatabaseReadError ERROR: Could not read data
    */
    public addParticipant = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let groupId = +req.body.groupId;
      let products = req.body.products;
      let participant = req.body.participant;
      let productIds = products.map((p: any) => p[0]);
      let discountIds = products.map((p: any) => p[1]);
      Promise.all([
        this.getProductsFromDb(productIds),
        this.createParticipant(participant),
        this.groupService.getGroup(groupId)
        ])
      .then((results: any) => {
        let products = results[0];
        let participant = results[1];
        let group = results[2];
        let paymentModel = this.participantPaymentModel;
        let self = this;
        participant.getPayments(function (err: Error, payments: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Payment data", ErrorType.DATABASE_READ);
            return res.status(500).send(errorMsg);
          } else {
            console.log("Payments: " + JSON.stringify(payments));
            let firstOpenPayment = payments.filter((p: any) => p.payment[0].payee_id === groupId).find((p: any) => p.isPaid === false);

              // If there's open payments, add products to that one
              if (firstOpenPayment) {

                // Remove old product selections
                self.removeOldProducts(firstOpenPayment).then((result: any) => {

                  // Add new product selections
                  self.addPaymentProducts(firstOpenPayment, products, discountIds).then((empty: any) => {
                    return res.status(204).send();
                  }).catch((err: APIError) => {
                    return res.status(err.statusCode).send(err.message);
                  });
                });
              } else {
                // Create new participant payment
                paymentModel.create({
                  isPaid: false
                }, function (err: Error, payment: any) {
                  if (err) {
                    let errorMsg = ErrorHandler.getErrorMsg("User Payment data", ErrorType.DATABASE_INSERTION);
                    return res.status(500).send(errorMsg);
                  } else {
                  // Add products to newly created user payment
                  self.addPaymentProducts(payment, products, discountIds).then((result: any) => {
                    group.getGroupPayment(function (err: Error, groupPayment: any) {
                      if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Group payment", ErrorType.NOT_FOUND);
                        return res.status(404).send();
                      }
                      // Link user payment to group payment
                      groupPayment[0].addParticipantPayments(payment, function (err: Error) {
                        if (err) {
                          let errorMsg = ErrorHandler.getErrorMsg("Group Payment data", ErrorType.DATABASE_UPDATE);
                          return res.status(500).send(errorMsg);
                        } else {
                          // Link user payment to user
                          participant.addPayments(payment, function (err: Error) {
                            if (err) {
                              let errorMsg = ErrorHandler.getErrorMsg("Participant Payment data",
                                ErrorType.DATABASE_UPDATE);
                              return res.status(500).send(errorMsg);
                            }
                            return res.status(200).json(participant);
                          });
                        }
                      });
                    });
                  }).catch((err: APIError) => {
                    return res.status(err.statusCode).send(err.message);
                  });
                }
              });
              }
            }
          });
      });
    }
    /**
    * @api {get} /group/:group/moderator/participants Get list of group's participant info's 
    * @apiName getParticipants
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiSuccess (200) participants List of group's participant
    * @apiError (404) DatabaseReadError ERROR: Group not found
    * @apiError (500) DatabaseReadError ERROR: Could not read data
    */
    public getParticipants = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;
      this.findParticipants(groupId).then((participantInfos: any) => {
        return res.status(200).json(participantInfos);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    /**
    * @api {get} /group/:group/moderator/products List products available for group
    * @apiName getAvailableProducts
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiSuccess (200) {JSON} List of event products
    * @apiError (500) DatabaseReadError ERROR: Event data could not be read from the database
    * @apiError (404) NotFound ERROR: Event was not found
    * @apiError (500) DatabaseReadError ERROR: Event product data could not be read from the database
    * @apiDeprecated use now (#Event:getProducts).
    */
    public getAvailableProducts = (req: express.Request, res: express.Response) => {
      let groupId = req.params.group;
      this.groupService.getAvailableProducts(groupId).
      then((products: any) => {
        return res.json(products);
      }).
      catch((error: APIError) => {
        return res.status(error.statusCode).send(error.message);
      });
    }
    /**
    * @api {get} /group/:group/moderator/participantpayment/:participant Get list of member's payments associated with the group
    * @apiName getParticipantPayments
    * @apiGroup Group
    * @apiParam {Number} group Group's unique id
    * @apiParam {Number} participant Participant's unique id
    * @apiSuccess (200) payments List of participant's payments
    * @apiError (404) DatabaseReadError ERROR: Group not found
    * @apiError (500) DatabaseReadError ERROR: Could not read data
    */
    // TODO: Error checking
    public getParticipantPayments = (req: express.Request, res: express.Response) => {
      let groupId = +req.params.group;
      let participantId: number = +req.params.participant;

      this.groupService.getParticipants(groupId).then((participants: any) => {
        let participant = participants.find((p: any) => p.id === participantId);
        return new Promise((resolve, reject) => {
          if (participant == null) {
            let msg = ErrorHandler.getErrorMsg("Participant not found in group", null);
            reject(new APIError(404, msg));
          } else {
            participant.getPayments((err: Error, participantPayments: any) => {
              return err ?
              reject(err) :
              resolve(participantPayments.filter((p: any) => p.groupPayment[0].payee_id === groupId));
            });
          }
        }).catch((err: APIError) => {
          console.log(err);
        });
      }).then((participantPayments: any) => {
        return this.groupService.getPaymentProducts(participantPayments);
      }).then((finalPayments: any[]) => {
        return res.status(200).json(this.mapPaymentProducts(finalPayments));
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }

    private findParticipants = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.groupService.getParticipants(groupId).then((participants: any) => {
          resolve(participants);
            /*
            let participantInfos = participants.map((payee: any) => {
              return {
               id: payee.id,
               name: payee.firstname + " " + payee.lastname,
                };
            });
            console.log("Got memberinfos");
            resolve(participantInfos);
            */
          }).catch((err: APIError) => {
            reject(err);
          });
        });
    }
    /**
    * @api {delete} "/group/:group/moderator/participants/:participant Remove a participant from group
    * @apiName removeParticipant
    * @apiGroup Group
    * @apiParam {Number} group Group unique id
    * @apiParam {String} participant participant's unque ID
    * @apiSuccess (200) participants list of participants after deletion
    * @apiError (500)  DatabaseReadError ERROR: Group data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: Group was not found
    * @apiError (500) DatabaseReadError ERROR: Participant data could not be read from the database
    * @apiError (404) DatabaseReadError ERROR: Participant was not found
    * @apiError (500) DatabaseDeleteError ERROR: Participant deletion failed
    */
    public removeParticipant = (req: express.Request, res: express.Response) => {
      // Group name or id?
      let groupId = req.params.group;
      let participantId: number = +req.params.participant;

      this.groupService.removeParticipant(groupId, participantId)
      .then((updatedParticipants: any[]) => {
        return res.status(200).json(updatedParticipants);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }

    private getMembers = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.groupService.getParticipantGroupMembers(groupId).then((members: any) => {
          let memberInfos = members.map((payee: any) => {
            return {
              id: payee.id,
              name: payee.firstname + " " + payee.lastname,
              isModerator: payee.isModerator
            };
          });
          resolve(memberInfos);
        }).catch((err: APIError) => {
          reject(err.message);
        });
      });
    }

    private mapPaymentProducts = (finalPayments: any[]) => {
      return finalPayments.map((fp: any) => {
        let prodSelectionInfos = fp.productSelections.map((ps: any) => {
          let discountInfo: any = ps.discount ? new DiscountInfo(ps.discount.id, ps.discount.name, ps.discount.amount) : null;
          let productInfo: any = new ProductInfo(ps.product.id, ps.product.name, ps.product.price);

          return new ProductSelectionInfo(productInfo, discountInfo);
        });

        return new PaymentInfo(fp.id, prodSelectionInfos, fp.isPaid, fp.paidOn);
      });
    }
    //This has been copypasted from group route, refactor to a service at some point
    private getProductsFromDb = (products: Number[]) => {
      return new Promise((resolve, reject) => {
        this.productModel.find({ id: products }, function (err: Error, products: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_READ);
            reject(new DatabaseError(500, errorMsg));
          } else if (!products) {
            let errorMsg = ErrorHandler.getErrorMsg("Product", ErrorType.NOT_FOUND);
            reject(new DatabaseError(400, errorMsg));
          } else {
            return resolve(products);
          }
        });
      });
    }
    private createParticipant = (participant: any) => {
      return new Promise((resolve, reject) => {
        this.participantModel.create({
          firstname: participant.firstname,
          lastname: participant.lastname,
          age: participant.age,
          allergies: participant.allergies
        }, function (error: any, newParticipant: any) {
          if (error) {
            let errorMsg = ErrorHandler.getErrorMsg("Participant data", ErrorType.DATABASE_INSERTION);
            reject(new DatabaseError(500, error));
          } else if (!newParticipant) {
            let errorMsg = ErrorHandler.getErrorMsg("Participant data", ErrorType.DATABASE_INSERTION);
            reject(new DatabaseError(400, errorMsg));
          } else {
            return resolve(newParticipant);
          }
        });
      });
    }

    //More copypasta from User route
    private addPaymentProducts = (payment: any, products: any[], discountIds: number[]) => {
      let selectionPromises: any = [];
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
    private removeOldProducts = (payment: any) => {
      let promises: any = [];

      payment.productSelections.forEach((ps: any) =>
        promises.push(new Promise((resolve, reject) => {

            // Dereference product selections from payment
            payment.removeProductSelections(ps, function (err: Error) {
            // Delete product selections
            ps.remove((err: Error) => err ? reject(err) : resolve(payment));
          });
          })));
      return Promise.all(promises);
    }
  }
}

export = Route;