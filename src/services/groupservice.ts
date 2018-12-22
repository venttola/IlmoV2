import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
// var _ = require("underscore-node");
// import * as _ from "underscore-node";
import { groupBy, flatten, reduce, uniq } from "underscore";
module Service {
  export class GroupService {

    constructor(private groupModel: any,
      private userService: any,
      private productModel: any,
      private discountModel: any,
      private participantModel: any,
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