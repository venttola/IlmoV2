import * as express from "express";
//import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { GroupService } from "../services/groupservice";
import { reduce } from "underscore";

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

    class CheckoutData {
        group: any;
        payments: any[];
        totalSum: number;
        refNumber: string;
        organizationBankAccount: string;
        isPaid: boolean;
    };

    export class GroupRoutes {
        constructor(private groupModel: any,
            private productModel: any,
            private discountModel: any,
            private userService: UserService,
            private groupService: GroupService) {

        }

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
        * @api {delete} api/group/:group/:username
        * @apiName Remove a group member
        * @apiGroup Group
        * @apiParam {Number} group Group unique id
        * @apiParam {String} username Username (email)
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Group data could not be read from the database
        * @apiError DatabaseReadError ERROR: Group was not found
        * @apiError DatabaseReadError ERROR: User data could not be read from the database
        * @apiError DatabaseReadError ERROR: User was not found
        * @apiError DatabaseDeleteError ERROR: Member deletion failed
        */
        public removeMember = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group; // Group name or id?
            let memberId: number = +req.params.member;

            this.groupService.removeMember(groupId, memberId)
                .then((currentMembers: any[]) => {
                    return res.status(200).json(currentMembers);
                }).catch((err: APIError) => {
                    return res.status(err.statusCode).send(err.message);
                });
        }

        /**
        * @api {patch} api/group/:group/moderator
        * @apiName Add a group moderator
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

            Promise.all([this.groupService.getGroup(groupId), this.userService.getUserById(memberId)]).then(values => {
                let group: any = values[0];
                let user: any = values[1];

                group.addModerator(user, function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Moderator", ErrorType.DATABASE_INSERTION);
                        return res.status(500).send(msg);
                    } else {
                        self.getMembers(groupId).then((memberInfos: any) =>
                            res.status(200).json(memberInfos))
                            .catch((err: APIError) => {
                                return res.status(err.statusCode).send(err.message);
                            });
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        /**
        * @api {delete} api/group/:group/:username/moderator
        * @apiName Remove a group moderator
        * @apiGroup Group
        * @apiParam {Number} group Group unique id
        * @apiParam {String} username Username (email)
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Group data could not be read from the database
        * @apiError DatabaseReadError ERROR: Group was not found
        * @apiError DatabaseReadError ERROR: User data could not be read from the database
        * @apiError DatabaseReadError ERROR: User was not found
        * @apiError DatabaseUpdateError ERROR: Moderator deletion failed
        */
        public removeModerator = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;
            let memberId = req.params.member;
            let self = this;

            this.groupService.removeModerator(groupId, memberId).then((members: any) => {
                console.log(members);
                return res.status(200).json(members);
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        public receiptPayment = (req: express.Request, res: express.Response) => {
            console.log("Receipting Payment");
            this.groupService.receiptMemberPayment(req.body.groupId, req.body.memberId)
                .then((paidPayments: any) => {
                    return this.groupService.getPaymentProducts(paidPayments);
                }).then((payments: any) => {
                    return res.status(200).json(this.mapPaymentProducts(payments));
                });
        }

        //TODO: Apidocs
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

        // TODO: ApiDocs
        public getGroupMembers = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;

            this.getMembers(groupId).then((memberInfos: any) =>
                res.status(200).json(memberInfos))
                .catch((err: APIError) => {
                    return res.status(err.statusCode).send(err.message);
                });
        }

        // TODO: ApiDocs
        // TODO: Error checking
        public getMemberPayments = (req: express.Request, res: express.Response) => {
            console.log("Getting member payments");
            let groupId = +req.params.group;
            let memberId: number = +req.params.member;

            this.groupService.getParticipantGroupMembers(groupId).then((members: any) => {
                let member = members.find((m: any) => m.id === memberId);

                return new Promise((resolve, reject) => {
                    if (member == null) {
                        let msg = ErrorHandler.getErrorMsg("User is not a member of the group", null);
                        reject(new APIError(404, msg));
                    } else {
                        member.getUserPayments((err: Error, userPayments: any) => {
                            console.log(userPayments);
                            return err ? reject(err) : resolve(userPayments.filter((p: any) => p.payment[0].payee_id === groupId));
                        });
                    }
                });
            }).then((userPayments: any) => {
                return this.groupService.getPaymentProducts(userPayments);
            }).then((finalPayments: any[]) => {
                return res.status(200).json(this.mapPaymentProducts(finalPayments));
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        public getGroupCheckout = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;

            let checkoutData: CheckoutData = new CheckoutData();

            this.groupService.getGroup(groupId)
                .then((group: any) => {
                    checkoutData.group = group;
                    return this.groupService.getParticipantGroupPayment(groupId);
                }).then((groupPayment: any) => {
                    checkoutData.isPaid = groupPayment[0].isPaid;
                    return this.groupService.getPaidUserPayments(groupId);
                }).then((paymentsByUser: any) => {
                    checkoutData.payments = paymentsByUser;
                    checkoutData.totalSum =
                        reduce(paymentsByUser.map((p: any) =>
                            (p.productSum - p.discountSum) as number),
                            (currentSum: number, userSum: number) => (currentSum + userSum)
                            , 0);
                    return this.groupService.getGroupRefNumber(checkoutData.group);
                }).then((refNumber: string) => {
                    checkoutData.refNumber = refNumber;
                    delete checkoutData.group.groupPayment; // Do not send all the payment info


                    return new Promise((resolve, reject) => {
                        this.groupService.getEventByGroup(checkoutData.group.id)
                            .then((event: any) => {
                                event.getOrganization((err: Error, organization: any) => {
                                    err ? reject(err) : resolve(organization.bankAccount);
                                });
                            });
                    });
                }).then((organizationBankAccount: string) => {
                    checkoutData.organizationBankAccount = organizationBankAccount;
                    return res.status(200).json(checkoutData);
                }).catch((err: APIError) => {
                    return res.status(err.statusCode).send(err.message);
                });
        }

        // Req is marked as type of any because Typescript compiler refuses to admit the existence of req.user attribute
        public checkModerator = (req: any, res: express.Response, next: express.NextFunction) => {
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
    }
}

export = Route;