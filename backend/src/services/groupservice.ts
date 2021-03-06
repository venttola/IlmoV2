import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
// var _ = require("underscore-node");
// import * as _ from "underscore-node";
var bankUtils = require("finnish-bank-utils");
var dateFormat = require("dateformat");
import { groupBy, flatten, reduce, uniq } from "underscore";
import { PaymentService } from "./paymentservice";
import { UserService } from "./userservice";
module Service {
  class CheckoutData {
    group: any;
    payments: any[];
    totalSum: number;
    refNumber: string;
    organizationBankAccount: string;
    isPaid: boolean;
    barcode: string;
  }
  export class GroupService {

    constructor(private groupModel: any,
      private userService: UserService,
      private paymentService: PaymentService,
      private productModel: any,
      private discountModel: any,
      private participantModel: any,
      private participantPaymentModel: any,
      private platoonModel: any,
      private eventService: any) { }

    public getGroup = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.groupModel.one({ id: groupId }, function (err: Error, group: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Group data", ErrorType.DATABASE_READ);
            reject(new DatabaseError(500, errorMsg));
          } else if (!group) {
            let errorMsg = ErrorHandler.getErrorMsg("Group", ErrorType.NOT_FOUND);
            reject(new DatabaseError(400, errorMsg));
          } else {
            resolve(group);
          }
        });
      });
    }

    public getParticipantGroupPayment = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getGroup(groupId)
        .then((group: any) => group.getGroupPayment((err: Error, groupPayment: any) => {
          err ? reject(err) : resolve(groupPayment);
        }));
      });
    }

    public getPaidUserPayments = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getParticipantGroupPayment(groupId)
        .then((groupPayment: any) => new Promise((resolve, reject) => {
          groupPayment[0].getUserPayments((err: Error, userPayments: any) => {
            err ? reject(err) : resolve(userPayments);
          });
        }))
        .then((userPayments: any[]) => {
          let promises = userPayments.filter((up: any) => up.isPaid).map((up: any) => new Promise((resolve, reject) => {
            up.getPayee((err: Error, payeeUser: any) => {
              up.payee = payeeUser[0].fullName();
              resolve(up);
            });
          }));

          return Promise.all(promises);
        }).then((payments: any) => {
          let paymentsByUser: any = groupBy(payments, (p: any) => p.payee);
          let promises = [];

          for (let payee in paymentsByUser) {
            if (payee) {
              let promise = new Promise((resolve, reject) => {
                this.getPaymentProducts(paymentsByUser[payee]).then((paymentsWithProds: any) => {
                  let allProducts = flatten(paymentsWithProds);

                  let prods = flatten(allProducts.map((payment: any) =>
                    payment.productSelections.map((prodSelection: any) => prodSelection.product)));

                  let discounts = flatten(allProducts.map((payment: any) =>
                    payment.productSelections.map((prodSelection: any) => prodSelection.discount)));

                  resolve({
                    member: payee,
                    productSum: reduce(prods.filter((p: any) => p != null)
                      .map((p: any) => p.price), (memo, num) => (memo + num), 0),
                    discountSum: reduce(discounts.filter((d: any) => d != null)
                      .map((d: any) => d.amount), (memo, num) => (memo + num), 0)
                  });
                });
              });

              promises.push(promise);
            }
          }

          Promise.all(promises).then((results: any) => resolve(results));
        });
      });
    }

    public getPaidParticipantPayments = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getParticipantGroupPayment(groupId)
        .then((groupPayment: any) => new Promise((resolve, reject) => {
          groupPayment[0].getParticipantPayments((err: Error, participantPayments: any) => {
            err ? reject(err) : resolve(participantPayments);
          });
        }))
        .then((participantPayments: any[]) => {
          let promises = participantPayments.filter((up: any) => up.isPaid).map((up: any) => new Promise((resolve, reject) => {
            up.getPayee((err: Error, payeeUser: any) => {
              up.payee = payeeUser[0].fullName();
              resolve(up);
            });
          }));

          return Promise.all(promises);
        }).then((payments: any) => {
          let paymentsByUser: any = groupBy(payments, (p: any) => p.payee);
          let promises = [];

          for (let payee in paymentsByUser) {
            if (payee) {
              let promise = new Promise((resolve, reject) => {
                this.getPaymentProducts(paymentsByUser[payee]).then((paymentsWithProds: any) => {
                  let allProducts = flatten(paymentsWithProds);

                  let prods = flatten(allProducts.map((payment: any) =>
                    payment.productSelections.map((prodSelection: any) => prodSelection.product)));

                  let discounts = flatten(allProducts.map((payment: any) =>
                    payment.productSelections.map((prodSelection: any) => prodSelection.discount)));

                  resolve({
                    member: payee,
                    productSum: reduce(prods.filter((p: any) => p != null)
                      .map((p: any) => p.price), (memo, num) => (memo + num), 0),
                    discountSum: reduce(discounts.filter((d: any) => d != null)
                      .map((d: any) => d.amount), (memo, num) => (memo + num), 0)
                  });
                });
              });

              promises.push(promise);
            }
          }

          Promise.all(promises).then((results: any) => resolve(results));
        });
      });
    }

    public getParticipantGroupMembers = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getParticipantGroupPayment(groupId)
        .then((groupPayment: any) => new Promise((resolve, reject) => {
          groupPayment[0].getUserPayments((err: Error, userPayments: any) => {
            err ? reject(err) : resolve(userPayments);
          });
        })).then((userPayments: any[]) => {
          let promises = userPayments.map((up: any) => {
            return new Promise((resolve, reject) => {
              up.getPayee((err: Error, payeeUser: any) => resolve(payeeUser[0]));
            });
          });

          Promise
          .all(promises)
          .then((payees: any) => {
            //console.log("Payees: " + JSON.stringify(payees));
            // Get only unique users, there can be multiple userpayments per user
            let uniquePayees = uniq(payees, false, (p: any) => p.id);

            //console.log("Unique payees: " + JSON.stringify(uniquePayees));

            this.getGroupModerators(groupId).then((moderators: any) => {
              let moderatorIds = moderators.map((m: any) => m.id);
              uniquePayees.forEach((up: any) => {
                if (moderatorIds.some((x: any) => x === up.id)) {
                  up.isModerator = true;
                } else {
                  up.isModerator = false;
                }
              });

              resolve(uniquePayees);
            });
          });
        });
      });
    }

    public getParticipants = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getParticipantGroupPayment(groupId)
        .then((groupPayment: any) => new Promise((resolve, reject) => {
          groupPayment[0].getParticipantPayments((err: Error, participantPayments: any) => {
            err ? reject(err) : resolve(participantPayments);
          });
        })).then((participantPayments: any[]) => {
          let promises = participantPayments.map((payment: any) => {
            return new Promise((resolve, reject) => {
              payment.getPayee((err: Error, payeeParticipant: any) => {
                err ? reject(err) : resolve(payeeParticipant[0]);
              });
            });
          });

          Promise.all(promises).then((payees: any) => {
            // Get only unique users, there can be multiple userpayments per user
            let uniquePayees = payees.filter((value: any, index: any, self: any) => {
              return self.indexOf(value) === index;
            });

            resolve(uniquePayees);
          });
        }).catch((error: APIError) => {
          console.log(error);
          reject(error);
        });
      });
    }

    // TODO: Platoon and platoon event getting should be refactored to a service
    public getAvailableProducts = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getGroup(groupId).then((group: any) => {
          group.getPlatoon((err: Error, platoon: any) => {
            if (err) {
              reject(err);
            } else {
              return resolve(this.eventService.getEventProducts(platoon[0].event[0].id));
              //The event is autofetched, and for some reason the platoo.getEvent does not find the event.
              /*
              platoon[0].getEvent((err: Error, event: any) => {
                if (err) {
                  reject(err);
                } else {
                  console.log(JSON.stringify(event));
                  return this.eventService.getEventProducts(event.id);
                }
              });
              */
            }
          });
        });
      });
    }

    public receiptGroupPayment = (groupId: number) => {
      console.log("Receipting group payment");

      return this.getParticipantGroupPayment(groupId)
      .then((groupPayment: any) => {
        //console.log("Grouppayment: " + JSON.stringify(groupPayment[0]));
        groupPayment[0].isPaid = true;
        groupPayment[0].paidOn = new Date();

        groupPayment[0].save((err: Error) => {
          console.log("Saved");
          if (err) {
            return err;
          } else {
            return groupPayment;
          }
        });
      });
    }

    public receiptMemberPayment(groupId: number, memberId: number) {
      return new Promise((resolve, reject) => {
        this.getAllMemberPayments(groupId)
        .then((userPayments: any[]) => {
          let unpaidPayments = userPayments.filter((up: any) => up.payeeId === memberId)
          .map((up: any) => new Promise((resolve, reject) => {
            if (!up.isPaid) {
              up.paidOn = new Date();
              up.isPaid = true;

              up.save((err: Error) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(up);
                }
              });
            } else {
              resolve(up);
            }
          }));

          Promise.all(unpaidPayments).then((paidPayments: any) => resolve(paidPayments));
        });
      });
    }

    public receiptParticipantPayment(groupId: number, participantId: number) {
      return new Promise((resolve, reject) => {
        this.getAllParticipantPayments(groupId)
        .then((userPayments: any[]) => {
          let unpaidPayments = userPayments.filter((up: any) => up.payeeId === participantId)
          .map((up: any) => new Promise((resolve, reject) => {
            if (!up.isPaid) {
              up.paidOn = new Date();
              up.isPaid = true;

              up.save((err: Error) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(up);
                }
              });
            } else {
              resolve(up);
            }
          }));

          Promise.all(unpaidPayments).then((paidPayments: any) => resolve(paidPayments));
        });
      });
    }

    // TODO: Combine with getGroupMembers
    private getAllMemberPayments = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getParticipantGroupPayment(groupId)
        .then((groupPayment: any) => new Promise((resolve, reject) => {
          groupPayment[0].getUserPayments((err: Error, userPayments: any) => {
            return err ? reject(err) : resolve(userPayments);
          });
        })).then((userPayments: any[]) => {
          let promises = userPayments.map((up: any) => {
            return new Promise((resolve, reject) => {
              up.getPayee((err: Error, payeeUser: any) => {
                up.payeeId = payeeUser[0].id;
                resolve(up);
              });
            });
          });

          Promise.all(promises).then((payees: any) => resolve(payees));
        });
      });
    }
    private getAllParticipantPayments = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getParticipantGroupPayment(groupId)
        .then((groupPayment: any) => new Promise((resolve, reject) => {
          groupPayment[0].getParticipantPayments((err: Error, participantPayments: any) => {
            return err ? reject(err) : resolve(participantPayments);
          });
        })).then((participantPayments: any[]) => {
          let promises = participantPayments.map((payment: any) => {
            return new Promise((resolve, reject) => {
              payment.getPayee((err: Error, payeeParticipant: any) => {
                payment.payeeId = payeeParticipant[0].id;
                resolve(payment);
              });
            });
          });
          Promise.all(promises).then((payees: any) => resolve(payees));
        });
      });
    }

    public removeMember = (groupId: number, memberId: number) => {
      return new Promise((resolve, reject) => {
        this.getAllMemberPayments(groupId).then((res: any) => {
          let memberPayments = res.filter((p: any) => p.payeeId === memberId);
          let removePromises = memberPayments.map((mp: any) => new Promise((resolve, reject) => {
            // Remove payment's product selections
            let psRemovePromises = mp.productSelections.map((ps: any) => new Promise((resolve, reject) => {
              ps.remove((err: Error) => err ? reject(err) : resolve(true));
            }));

            // Remove member payments
            Promise.all(psRemovePromises).then((result: any) => {
              mp.remove((err: Error) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(true);
                }
              });
            });
          }));

          return Promise.all(removePromises).then((result: any) => new Promise((resolve, reject) => {
            this.removeModerator(groupId, memberId).then((members: any) => resolve(members));
          }));
        }).then((updatedMembers: any) => {
          resolve(updatedMembers);
        });
      });
    }

    public removeModerator = (groupId: number, memberId: number) => {
      let self = this;

      return Promise.all([this.getGroup(groupId), this.userService.getUserById(memberId)]).then(values => {
        let group: any = values[0];
        let user: any = values[1];

        return new Promise((resolve, reject) => {
          group.removeModerator(user, function (err: Error) {
            if (err) {
              reject(err);
            } else {
              self.getParticipantGroupMembers(groupId).then((memberInfos: any) => {
                let userInfo = memberInfos.map((up: any) => {
                  if (up) {
                    return {
                      id: up.id,
                      name: up.firstname + " " + up.lastname
                    };
                  }
                });

                resolve(userInfo);
              }).catch((err: APIError) => {
                reject(err);
              });
            }
          });
        });
      }).then((members: any) => members);
    }

    public getEventStatusByParticipantgroup = (groupId: number) => {
      return this.getEventByGroup(groupId)
      .then((event: any) => event.registerationOpen);
    }

    public getEventByGroup = (groupId: any) => {
      return new Promise((resolve, reject) => {
        this.getGroup(groupId).then((group: any) => {
          return new Promise((resolve, reject) => {
            resolve(group);
          });
        }).then((group: any) => {
          return new Promise((resolve, reject) => {
            resolve(group.platoon[0]);
          });
        }).then((platoon: any) => {
          platoon.getEvent((err: Error, event: any) => {
            resolve(event[0]);
          });
        });
      });
    }

    public getPaymentProducts = (userPayments: any) => {
      let productPromises = userPayments.map((up: any) => {
        return new Promise((resolve, reject) => {
          let promises = up.productSelections.map((ps: any) => {
            return new Promise((resolve, reject) => {
              this.productModel.one({ id: ps.product_id }, (err: Error, product: any) => {
                ps.product = product;

                this.discountModel.one({ id: ps.discount_id }, (err: Error, discount: any) => {
                  ps.discount = discount;
                  resolve(ps);
                });
              });
            });
          });

          Promise.all(promises).then((results: any) => {
            up.productSelections = results;
            resolve(up);
          });
        });
      });

      return Promise.all(productPromises);
    }

    public getGroupRefNumber(group: any) {
      return new Promise((resolve, reject) => {
        group.getGroupPayment((err: Error, payment: any) => {
          return err ? reject(err) : resolve(payment[0].referenceNumber);
        });
      });
    }

    public removeParticipant = (groupId: number, participantId: number) => {
      return new Promise((resolve, reject) => {
        this.getAllParticipantPayments(groupId).then((res: any) => {
          let participantPayments = res.filter((p: any) => p.payeeId === participantId);
          let removePromises = participantPayments.map((payment: any) => new Promise((resolve, reject) => {
            // Remove payment's product selections
            let psRemovePromises = payment.productSelections.map((ps: any) => new Promise((resolve, reject) => {
              ps.remove((err: Error) => err ? reject(err) : resolve(true));
            }));

            // Remove participant payments
            Promise.all(psRemovePromises).then((result: any) => {
              payment.remove((err: Error) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(true);
                }
              });
            });
          }));

          return Promise.all(removePromises).then((result: any) => new Promise((resolve, reject) => {
            this.getParticipants(groupId).then((participants: any) => resolve(participants));
          }));
        }).then((updatedParticipants: any) => {
          resolve(updatedParticipants);
        });
      });
    }
    public getGroupEvent(groupId: number) {
      return new Promise((resolve, reject) => {
        this.getGroup(groupId).then((group: any) => {
          group.getPlatoon((err: Error, platoon: any) => {
            if (err) {
              console.log("Platoon not found");
              reject(err);
            } else {
              let event = platoon[0].event[0];
              resolve(event);
            }
          });
        });
      });
    }
    public getProductSums(groupId: number) {
      return new Promise((resolve, reject) => {
        this.getGroup(groupId).then((group: any) => {
          let participantProducts = this.getAllParticipantPayments(groupId).then((payments: any) => {
            return payments.map((payment: any) => {
              return payment.productSelections.map((selection: any) => {
                return({productId: selection.product_id, discountId: selection.discount_id});
              });
            });
          });
          let memberProducts = this.getAllMemberPayments(groupId).then((payments: any) => {
            return payments.map((payment: any) => {
              return payment.productSelections.map((selection: any) => {
                return({productId: selection.product_id, discountId: selection.discount_id});
              });
            });
          });
          let availableProducts =  this.getAvailableProducts(groupId).then((products: any) => {
            return products.map( (product: any) => {
              return( {name: product.name, id: product.id, price: product.price, discounts: product.discounts });
            });
          });
          Promise.all([availableProducts, participantProducts, memberProducts]).then((results: any) => {
            return results[0].map((product: any) => {
              product.sum = 0;
              product.sumPrice = 0;
              product.total = 0;
              product.discounts.map((discount: any) => {
                discount.sum = 0;
                discount.sumPrice = 0;
              });
              let selections = results[1].concat(results[2]);
              for (let selection of selections) {
                for (let selectedProduct of selection) {
                  if (selectedProduct.productId === product.id) {
                    product.sum++;
                    product.sumPrice += product.price;
                    product.total += product.price;
                    if (selectedProduct.discountId !== null) {
                      product.total += +product.discounts.map((discount: any) => {
                        if (discount.id === selectedProduct.discountId) {
                          discount.sum++;
                          discount.sumPrice += discount.amount;

                          return discount.amount;
                        }
                      });
                    }
                  }
                }
              }
              return { name: product.name,
                id: product.id,
                price: product.price,
                sum: product.sum,
                sumPrice: product.sumPrice,
                total: product.total,
                discounts: product.discounts };
              });
          }).then((productSums: any) => {
            resolve(productSums);
          });
        });
      });
    }
    public addModerator = (groupId: number, userId: number) => {
      return new Promise ((resolve, reject) => {
        Promise.all([this.getGroup(groupId), this.userService.getUserById(userId)]).then(values => {
          let group: any = values[0];
          let user: any = values[1];

          group.addModerator(user, function (err: Error) {
            if (err) {
              let msg = ErrorHandler.getErrorMsg("Moderator", ErrorType.DATABASE_INSERTION);
              reject (new DatabaseError(500, msg));
            } else {
              this.getMemberInfo(groupId).then((memberInfos: any) =>
                resolve(memberInfos))
              .catch((err: APIError) => {
                reject(err);
              });
            }
          });
        });
      });
    }
    public getMemberInfo = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getParticipantGroupMembers(groupId).then((members: any) => {
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
    public findMemberInGroup = (userId: number, groupId: number) => {
      return new Promise ((resolve, reject) => {
        this.getParticipantGroupMembers(groupId)
        .then((members: any) => {
          let member = members.find((m: any) => m.id === userId);
          if (member == null) {
            let msg = ErrorHandler.getErrorMsg("User is not a member of the group", null);
            reject(new APIError(404, msg));
          } else {
            resolve(member);
          }
        });
      });
    }
    public filterUserPaymentsForGroup = (memberId: number, groupId: number) => {
      return new Promise((resolve, reject) => {
        this.findMemberInGroup(memberId, groupId)
        .then((member: any) => {
          member.getUserPayments((err: Error, userPayments: any) => {
            return err ? reject(err) : resolve(userPayments.filter((p: any) => p.groupPayment[0].payee_id === groupId));
          });
        });
      });
    }
    public getParticipantGroupCheckout = (groupId: number) => {
      let checkoutData: CheckoutData = new CheckoutData();

      return this.getGroup(groupId)
      .then((group: any) => {
        checkoutData.group = group;
        return this.getParticipantGroupPayment(groupId);
      }).then((groupPayment: any) => {
        checkoutData.isPaid = groupPayment[0].isPaid;
        return this.getPaidUserPayments(groupId);
      }).then((paymentsByUser: any) => {
        checkoutData.payments = paymentsByUser;

        return this.getPaidParticipantPayments(groupId);
      }).then((paymentsByParticipant: any) => {

        checkoutData.payments = checkoutData.payments.concat(paymentsByParticipant);

        checkoutData.totalSum =
        reduce(checkoutData.payments.map((p: any) =>
          (p.productSum + p.discountSum) as number),
        (currentSum: number, userSum: number) => (currentSum + userSum)
        , 0);

        return this.getGroupRefNumber(checkoutData.group);
      }).then((refNumber: string) => {
        checkoutData.refNumber = refNumber;
        delete checkoutData.group.groupPayment; // Do not send all the payment info
        return new Promise((resolve, reject) => {
          this.getEventByGroup(checkoutData.group.id)
          .then((event: any) => {
            event.getOrganization((err: Error, organization: any) => {
              err ? reject(err) : resolve(organization.bankAccount);
            });
          });
        });
      }).then((organizationBankAccount: string) => {
        checkoutData.organizationBankAccount = organizationBankAccount;

        let barcode = bankUtils.formatFinnishVirtualBarCode({
          iban: bankUtils.formatFinnishIBAN(organizationBankAccount),
          sum: checkoutData.totalSum,
          reference: bankUtils.formatFinnishRefNumber(checkoutData.refNumber),
          date: dateFormat(new Date(), "dd.mm.yyyy")
        });

        checkoutData.barcode = barcode;
        return checkoutData;
      }).catch((err: APIError) => {
        return err;
      });
    }
    public createParticipant = (participant: any) => {
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
    //TODO: Refactor this spaghetti.
    public createParticipantPayment = (groupId: number, participant: any, productIds: any, discountIds: any) => {
      return new Promise((resolve, reject) => {
        let self = this;
        this.participantPaymentModel.create({
          isPaid: false
        }, function (err: Error, payment: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("User Payment data", ErrorType.DATABASE_INSERTION);
            reject(new DatabaseError(500, errorMsg));
          } else {
            // Add products to newly created user payment
            self.paymentService.addPaymentProducts(payment, productIds, discountIds)
            .then((result: any) => {
              self.getGroup(groupId)
              .then((group: any) => {
                group.getGroupPayment(function (err: Error, groupPayment: any) {
                  if (err) {
                    let errorMsg = ErrorHandler.getErrorMsg("Group payment", ErrorType.NOT_FOUND);
                    reject(new DatabaseError(404, errorMsg));
                  }
                  // Link user payment to group payment
                  groupPayment[0].addParticipantPayments(payment, function (err: Error) {
                    if (err) {
                      let errorMsg = ErrorHandler.getErrorMsg("Group Payment data", ErrorType.DATABASE_UPDATE);
                      reject(new DatabaseError(500, errorMsg));
                    } else {
                      // Link user payment to user
                      participant.addPayments(payment, function (err: Error) {
                        if (err) {
                          let errorMsg = ErrorHandler.getErrorMsg("Participant Payment data",
                            ErrorType.DATABASE_UPDATE);
                          reject(new DatabaseError(500, errorMsg));
                        }
                        resolve(participant);
                      });
                    }
                  });
                });
              }).catch((err: APIError) => {
                reject (err);
              });
            });
          }
        });
      });
    }
    public getPaymentsForParticipant = (participantId: number) => {
      return new Promise((resolve, reject) => {
        this.participantModel.one({ id: participantId }, function (err: Error, participant: any) {
          if (participant == null) {
            let msg = ErrorHandler.getErrorMsg("Participant not found in group", null);
            reject(new APIError(404, msg));
          } else {
            participant.getPayments((err: Error, participantPayments: any) => {
              return err ?
              reject(err) :
              resolve(participantPayments);
            });
          }
        });
      });
    }
    private getGroupModerators = (groupId: number) => {
      return new Promise((resolve, reject) => {
        this.getGroup(groupId).then((group: any) => {
          group.getModerator((err: Error, moderators: any) => {
            err ? reject(err) : resolve(moderators);
          });
        });
      });
    }
  }
}

export = Service;