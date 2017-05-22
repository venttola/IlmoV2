import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
    export class GroupService {
        constructor(private groupModel: any) { }

        public getGroup = (groupId: Number) => {
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

        public getGroupPayment = (groupId: Number) => {
            return new Promise((resolve, reject) => {
                this.getGroup(groupId)
                    .then((group: any) => group.getGroupPayment((err: Error, groupPayment: any) => {
                        return err ? reject(err) : resolve(groupPayment);
                    }));
            });
        }

        public getGroupMembers = (groupId: Number) => {
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

    }
}

export = Service;