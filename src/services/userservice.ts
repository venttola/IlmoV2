//import Promise from "ts-promise";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
    export class UserService {
        constructor(private userModel: any,
            private userPaymentModel: any,
            private productSelectionModel: any,
            private productModel: any) { }

        public getUser = (email: string) => {
            return new Promise((resolve, reject) => {
                this.userModel.one({ email: email }, function (err: Error, user: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("User data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!user) {
                        let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(user);
                    }
                });
            });
        };

        public getUserById = (id: number) => {
            return new Promise((resolve, reject) => {
                this.userModel.one({ id: id }, function (err: Error, user: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("User data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!user) {
                        let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(user);
                    }
                });
            });
        };

        public getUserPayments = (email: string) => {
            return new Promise((resolve, reject) => {
                this.getUser(email).then((user: any) => {
                    user.getUserPayments((err: Error, payments: any) => {
                        return err ? reject(err) : resolve(payments);
                    });
                });
            });
        };

        public createUserPaymentWithSelections = (username: string, prodSelections: any, groupPayment: any) => {
            return new Promise((resolve, reject) => {
                this.userPaymentModel.create({
                    isPaid: false
                }, (err: Error, payment: any) => {
                    console.log("Created new payment");
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("User Payment data", ErrorType.DATABASE_INSERTION);
                        reject(new APIError(500, errorMsg));
                    } else {
                        // Add products to newly created user payment
                        let prodIds = prodSelections.map((s: any) => s[0]);
                        let discountIds = prodSelections.map((s: any) => s[1]);

                        console.log("ProdIDs: " + prodIds);
                        console.log("DiscountIDs: " + discountIds);

                        this.getProductsFromDb(prodIds)
                            .then((products: any) => {
                                console.log("Fetched products: " + JSON.stringify(products));
                                return this.addPaymentProducts(payment, products, discountIds);
                            }).then((result: any) => {
                                console.log("Result: " + result);
                                // Add user payment to group payment
                                return new Promise((resolve, reject) => {
                                    console.log("groupPayment: " + JSON.stringify(groupPayment));
                                    groupPayment[0].addUserPayments(payment, (err: Error) => {
                                        console.log("asd");
                                        err ? reject(err) : resolve(payment);
                                    });
                                });
                            }).then((result: any) => {
                                console.log("Getting user");
                                return this.getUser(username);
                            }).then((user: any) => {
                                // Add payment to user
                                user.addUserPayments(payment, (err: Error) => {
                                    if (err) {
                                        let errorMsg = ErrorHandler.getErrorMsg("User Payment data", ErrorType.DATABASE_UPDATE);
                                        reject(new APIError(500, errorMsg));
                                    } else {
                                        resolve(payment);
                                    }
                                });
                            });
                    }
                });
            });
        }

        public addPaymentProducts = (payment: any, products: any[], discountIds: number[]) => {
            let selectionPromises: any = [];

            products.forEach((p: any) => {
                selectionPromises.push(new Promise((resolve, reject) => {
                    this.productSelectionModel.create({}, function (err: Error, ps: any) {
                        ps.setProduct(p, function (err: Error) {
                            let disc = p.discounts.find((d: any) => discountIds.some((di: any) => di === d.id));

                            if (disc) {
                                ps.setDiscount(disc, (err: Error) =>
                                    err ? reject(err)
                                        : payment.addProductSelections(ps, (err: Error) =>
                                            err ? reject(err)
                                                : resolve(true)));
                            } else {
                                console.log("Adding product selection to user payment");
                                payment.addProductSelections(ps, (err: Error) => err ? reject(err) : resolve(true));
                            }
                        });
                    });
                }));
            });

            return Promise.all(selectionPromises);
        }

        public getProductsFromDb = (products: Number[]) => {
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
        public getOrganizationMemberships = (userId: number) => {
            return new Promise((resolve, reject) => {
                this.getUserById(userId).then((user: any) => {
                    user.getOrganizations(function(err: any, organizations: any){
                        if (err) {
                            return reject(err);
                        } else {
                             //console.log("User '" + user.email + "' Organizations: " + JSON.stringify(organizations));
                            return resolve(organizations);
                        }
                    });
                });
            });
        }
    }
}

export = Service;