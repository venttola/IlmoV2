import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
    export class GroupService {
        constructor(private groupModel: any) { }

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
                        return resolve(group);
                    }
                });
            });
        }

        public getGroupPayment = (groupId: number) => {
            return new Promise((resolve, reject) => {
                this.getGroup(groupId)
                    .then((group: any) => group.getGroupPayment((err: Error, groupPayment: any) => {
                        return err ? reject(err) : resolve(groupPayment);
                    }));
            });
        }

        public getGroupMembers = (groupId: number) => {
            return new Promise((resolve, reject) => {
                this.getGroupPayment(groupId)
                    .then((groupPayment: any) => new Promise((resolve, reject) => {
                        groupPayment[0].getUserPayments((err: Error, userPayments: any) => {
                            return err ? reject(err) : resolve(userPayments);
                        });
                    })).then((userPayments: any[]) => {
                        let promises = userPayments.map((up: any) => {
                            return new Promise((resolve, reject) => {
                                up.getPayee((err: Error, payeeUser: any) => resolve(payeeUser[0]));
                            });
                        });

                        Promise.all(promises).then((payees: any) => {
                            // Get only unique users, there can be multiple userpayments per user
                            let uniquePayees = payees.filter((value: any, index: any, self: any) => {
                                return self.indexOf(value) === index;
                            });

                            resolve(uniquePayees);
                        });
                    });
            });
        }

        public receiptMemberPayment(groupId: number, memberId: number) {
            console.log(JSON.stringify("groupId: " + groupId));
            console.log(JSON.stringify("memberId: " + memberId));

            return new Promise((resolve, reject) => {
                this.getAllMemberPayments(groupId)
                    .then((userPayments: any[]) => {
                        console.log(JSON.stringify("userPayments: " + JSON.stringify(userPayments)));
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
                                }
                            }));

                        Promise.all(unpaidPayments).then((paidPayments: any) => resolve(paidPayments));
                    });
            });
        }

        // TODO: Combine with getGroupMembers
        private getAllMemberPayments = (groupId: number) => {
            return new Promise((resolve, reject) => {
                this.getGroupPayment(groupId)
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

        public removeMember = (groupId: number, memberId: number) => {
            return new Promise((resolve, reject) => {
                this.getAllMemberPayments(groupId).then((res: any) => {
                    let memberPayments = res.filter((p: any) => p.payeeId === memberId);
                    let removePromises = memberPayments.map((mp: any) => new Promise((resolve, reject) => {
                        // Remove payment's product selections
                        let psRemovePromises = mp.productSelections.map((ps: any) => new Promise((resolve, reject) => {
                            ps.remove((err: Error) => err ? reject(err) : resolve(true));
                        }));

                        // Remove member payment
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

                    return Promise.all(removePromises);
                }).then((removed: any) => {
                    return this.getGroupMembers(groupId);
                }).then((updatedMembers: any) => {
                    let userInfo = updatedMembers.map((up: any) => {
                        return {
                            id: up.id,
                            name: up.firstname + " " + up.lastname
                        };
                    });

                    resolve(userInfo);
                });
            });
        }

    }
}

export = Service;