import * as express from "express";
//import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { GroupService } from "../services/groupservice";

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
        * @api {post} api/group Adds new group
        * @apiName New group
        * @apiGroup Group
        * @apiParam {JSON} name {name: "Group name"}
        * @apiParam {JSON} description {description: "Group description"}
        * @apiSuccess (204) -
        * @apiError DatabaseInsertionError ERROR: Group data insertion failed
        */
        // public addGroup = (req: express.Request, res: express.Response) => {
        //     this.groupModel.create({
        //         name: req.body.name,
        //         description: req.body.description
        //     }, function (err: Error, group: any) {
        //         if (err) {
        //             let errorMsg = ErrorHandler.getErrorMsg("Group data", ErrorType.DATABASE_INSERTION);
        //             return res.status(500).send(errorMsg);
        //         } else {
        //             return res.status(204).send();
        //         }
        //     });
        // }

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
            let username = req.params.username;

            Promise.all([this.groupService.getGroup(groupId), this.userService.getUser(username)]).then(values => {
                let group: any = values[0];
                let user: any = values[1];

                group.removeGroupModerator(user, function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Moderator", ErrorType.DATABASE_DELETE);
                        return res.status(500).send(msg);
                    } else {
                        return res.status(204).send();
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        /**
        * @api {get} api/group/:group/:username/products
        * @apiName Ger product list of a specific user
        * @apiGroup Group
        * @apiParam {Number} group Group unique id
        * @apiParam {String} username Username (email)
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Group data could not be read from the database
        * @apiError DatabaseReadError ERROR: Group was not found
        * @apiError DatabaseReadError ERROR: User data could not be read from the database
        * @apiError DatabaseReadError ERROR: User was not found
        * @apiError DatabaseConstraintError ERROR: User is not a member of the group
        */
        // public getMemberProducts = (req: express.Request, res: express.Response) => {
        //     let groupId = req.params.group;
        //     let username = req.params.username;

        //     Promise.all([this.groupService.getGroup(groupId), this.userService.getUser(username)]).then(values => {
        //         let group: any = values[0];
        //         let user: any = values[1];

        //         group.hasMembers(user, function (err: Error) {
        //             if (err) {
        //                 let msg = ErrorHandler.getErrorMsg("User is not a member of the group", null);
        //                 return res.status(500).send(msg);
        //             } else {
        //                 // TODO: Check that this is correct (assuming user belongs only to one group)
        //                 user.getProducts(function (err: Error, prods: any) {
        //                     return res.status(200).send(prods);
        //                 });
        //             }
        //         });
        //     }).catch((err: APIError) => {
        //         return res.status(err.statusCode).send(err.message);
        //     });
        // }

        public receiptPayment = (req: express.Request, res: express.Response) => {
            this.groupService.receiptMemberPayment(req.body.groupId, req.body.memberId)
                .then((paidPayments: any) => {
                    return this.getPaymentProducts(paidPayments);
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

        // TODO: ApiDocs
        // TODO: Error checking
        public getMemberPayments = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;
            let memberId: number = +req.params.member;

            this.groupService.getParticipantGroupMembers(groupId).then((members: any) => {
                let member = members.find((m: any) => m.id === memberId);

                return new Promise((resolve, reject) => {
                    if (member == null) {
                        let msg = ErrorHandler.getErrorMsg("User is not a member of the group", null);
                        reject(new APIError(404, msg));
                    } else {
                        member.getUserPayments((err: Error, userPayments: any) => {
                            return err ? reject(err) : resolve(userPayments);
                        });
                    }
                });
            }).then((userPayments: any) => {
                return this.getPaymentProducts(userPayments);
            }).then((finalPayments: any[]) => {
                return res.status(200).json(this.mapPaymentProducts(finalPayments));
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

        private getPaymentProducts = (userPayments: any) => {
            let productPromises = userPayments.map((up: any) => {
                return new Promise((resolve, reject) => {
                    let promises = up.productSelections.map((ps: any) => {
                        return new Promise((resolve, reject) => {
                            this.productModel.one({ id: ps.product_id }, (err: Error, product: any) => {
                                ps.product = product;

                                this.discountModel.one({ id: ps.discount_id }, (err: Error, discount: any) => {
                                    ps.discount = discount;
                                    resolve(up);
                                });
                            });
                        });
                    });

                    Promise.all(promises).then((results: any) => {
                        resolve(results);
                    });
                });
            });

            return Promise.all(productPromises);
        }

        private mapPaymentProducts = (finalPayments: any[]) => {
            return finalPayments.map((fp: any) => {
                let prodSelectionInfos = fp[0].productSelections.map((ps: any) => {
                    let discountInfo: any = ps.discount ? new DiscountInfo(ps.discount.id, ps.discount.name, ps.discount.amount) : null;
                    let productInfo: any = new ProductInfo(ps.product.id, ps.product.name, ps.product.price);

                    return new ProductSelectionInfo(productInfo, discountInfo);
                });

                return new PaymentInfo(fp[0].id, prodSelectionInfos, fp[0].isPaid, fp[0].paidOn);
            });
        }
    }
}

export = Route;