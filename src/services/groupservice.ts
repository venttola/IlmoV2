import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
    export class GroupService {
        constructor(private groupModel: any, private userService: any) { }

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

        private getParticipantGroupPayment = (groupId: number) => {
            return new Promise((resolve, reject) => {
                this.getGroup(groupId)
                    .then((group: any) => group.getGroupPayment((err: Error, groupPayment: any) => {
                        err ? reject(err) : resolve(groupPayment);
                    }));
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

                        Promise.all(promises).then((payees: any) => {
                            // Get only unique users, there can be multiple userpayments per user
                            let uniquePayees = payees.filter((value: any, index: any, self: any) => {
                                return self.indexOf(value) === index;
                            });

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
                                    console.log("up: " + JSON.stringify(up));
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