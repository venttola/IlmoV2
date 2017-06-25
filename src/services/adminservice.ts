//import Promise from "ts-promise";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { uniq, flatten, contains } from "underscore";
var bankUtils = require("finnish-bank-utils");
var dateFormat = require("dateformat");
module Service {
    export class AdminService {
        constructor(private userModel: any,
                    private groupPaymentModel: any) { }

        public getAllUsers = (query: string) => {
            return new Promise((resolve, reject) => {
                console.log(query);
                this.userModel.all(function (err: Error, users: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("User data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!users) {
                        let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        let userData = users.map((user: any) => {
                                user.password = undefined;
                                return user;
                            });
                     //   userdata       .filter((user: any) => );
                         if (query) {
                             userData = userData.filter((user: any) => {
                                 if (user.firstname.indexOf(query) !== -1 ||
                                     user.lastname.indexOf(query) !== -1 ) {
                                     return user;
                                 }
                             });
                         }
                        return resolve(userData);
                    }
                });
            });
        };
        public generateReferencenumbers = () => {
            return new Promise((resolve, reject) => {
                this.groupPaymentModel.all(function (err: Error, payments: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("User data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!payments) {
                        let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        let updatedPayments = payments.map((payment: any) => {
                            console.log(JSON.stringify(payment));
                            let newRef = bankUtils.generateFinnishRefNumber();
                            console.log(newRef);
                            payment.referenceNumber = newRef;
                            payment.save(function(err: any) {
                                if (err) {
                                    reject(err);
                                }
                            });

                        });
                        return resolve(payments);
                    }
                });
            });
        }
}
}

export = Service;