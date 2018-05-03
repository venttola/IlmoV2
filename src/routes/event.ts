import * as express from "express";
//import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { OrganizationService } from "../services/organizationservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import * as config from "config";
const bankUtils = require("finnish-bank-utils");

module Route {

    class Event {
        constructor(private id: number,
            private name: string,
            private startDate: Date,
            private endDate: Date,
            private description: string,
            private registerationOpen: boolean) { }
    }
    class Product {
        name: string;
        price: string;
    }
    class Discount {
        name: string;
        amount: string;
    }
    class Platoon {
        constructor(public id: number,
            public name: string) { }
    }
    export class EventRoutes {
        constructor(private eventModel: any,
            private productModel: any,
            private discountModel: any,
            private platoonModel: any,
            private participantGroupModel: any,
            private groupPaymentModel: any,
            private userService: UserService,
            private organizationService: OrganizationService) {
        }

        /**
        * @api {post} api/events Adds new event
        * @apiName New event
        * @apiGroup Event
        * @apiParam {JSON} name {name: "Event name"}
        * @apiParam {JSON} startDate {startDate: "2017-01-01T12:00:00+0200"}
        * @apiParam {JSON} endDate {endDate: "2017-01-02T12:00:00+0200"}
        * @apiSuccess (204) -
        * @apiError DatabaseInsertionError ERROR: Event data insertion failed
        */
        public addEvent = (req: express.Request, res: express.Response) => {
            this.eventModel.create({
                name: req.body.name,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                description: req.body.description,
                registerationOpen: req.body.registerationOpen
            }, function (err: Error, items: any) {
                if (err) {
                    let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_INSERTION);
                    return res.status(500).send(errorMsg);
                } else {
                    return res.status(200).json({ data: { event: items } });
                }
            });
        }
        /**
        * @api {patch} api/events/:event Updated event data
        * @apiName New event
        * @apiGroup Event
        * @apiParam {JSON} name {name: "Event name"}
        * @apiParam {JSON} startDate {startDate: "2017-01-01T12:00:00+0200"}
        * @apiSuccess (204) -
        * @apiError DatabaseInsertionError ERROR: Event data insertion failed
        */


        /**
        * @api {delete} api/events/:event
        * @apiName Delete event
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiSuccess (204) -
        * @apiError DatabaseDeleteError ERROR: Event data deletion failed
        */
        public deleteEvent = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;

            this.getEvent(eventId).then((event: any) => {
                event.remove(function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Event", ErrorType.DATABASE_DELETE);
                        return res.status(500).send(msg);
                    } else {
                        return res.status(204).send();
                    }
                });
            })
                .catch((err: APIError) => {
                    return res.status(err.statusCode).send(err.message);
                });
        }

        /**
        * @api {get} api/events Lists all events
        * @apiName List events
        * @apiGroup Event
        * @apiSuccess {JSON} List of events
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        */
        public getEvents = (req: express.Request, res: express.Response) => {
            this.eventModel.all(function (err: Error, events: any) {
                if (err) {
                    let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_READ);
                    return res.status(500).send(errorMsg);
                } else {
                    return res.status(200).json(events);
                }
            });
        }

        /**
        * @api {get} api/events/:event/product Lists event products
        * @apiName List event products
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiSuccess {JSON} List of event products
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        * @apiError NotFound ERROR: Event was not found
        * @apiError DatabaseReadError ERROR: Event product data could not be read from the database
        */
        public getEventProducts = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;

            this.eventModel.one({ id: eventId }, function (err: Error, event: any) {
                if (err) {
                    let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_READ);
                    return res.status(500).send(errorMsg);
                } else if (!event) {
                    let errorMsg = ErrorHandler.getErrorMsg("Event", ErrorType.NOT_FOUND);
                    return res.status(404).send(errorMsg);
                } else {
                    event.getProducts(function (err: Error, prods: any) {
                        if (err) {
                            let errorMsg = ErrorHandler.getErrorMsg("Event product data", ErrorType.DATABASE_READ);
                            return res.status(500).send(errorMsg);
                        } else {
                            return res.status(200).json(prods);
                        }
                    });
                }
            });
        }

        /**
        * @api {post} api/events/:event/product Adds event products
        * @apiName Add event product
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiParam {JSON} name {name: "Product name"}
        * @apiParam {JSON} price {price: "Product price"}
        * @apiParam {JSON} discounts [{name: "Free entry"}, amount: 10]
        * @apiSuccess (200) JSON {id: 1, name: "Product name", price: "Product price"}
        * @apiError DatabaseInsertionError ERROR: Product data insertion failed
        * @apiError NotFound ERROR: Event was not found
        * @apiError DatabaseInsertionError ERROR: Adding product to event failed
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        */
        public addProduct = (req: express.Request, res: express.Response) => {
            console.log("Adding product");
            console.log("Body: " + JSON.stringify(req.body));

            let eventId = req.params.event;
            let productName = req.body.name;
            let productPrice = req.body.price;
            let discounts: any[] = [];

            try {
                discounts = JSON.parse(req.body.discounts);
            } catch (e) {
                console.log(e);
            }

            this.getEvent(eventId).then((event: any) => {
                this.productModel.create({
                    name: productName,
                    price: productPrice
                }, function (err: Error, prod: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_INSERTION);
                        return res.status(500).send(errorMsg);
                    } else {
                        event.addProducts(prod, function (err: Error) {
                            if (err) {
                                return res.status(500).send("ERROR: Adding product to event failed");
                            } else {
                                return res.status(204).send();
                            }
                        });
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        /**
        * @api {patch} api/events/:event/product Adds event products
        * @apiName Update event product
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiParam {JSON} name {name: "Product name"}
        * @apiParam {JSON} price {price: "Product price"}
        * @apiParam {JSON} discounts [{name:"Ilmainen tapahtuma", amount:10}]
        * @apiSuccess (200) JSON {id: 1, name: "Product name", price: "Product price"}
        * @apiError DatabaseInsertionError ERROR: Product data insertion failed
        * @apiError NotFound ERROR: Event was not found
        * @apiError DatabaseInsertionError ERROR: Adding product to event failed
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        */
        public updateProduct = (req: express.Request, res: express.Response) => {
            let self = this;
            let eventId: number = req.params.event;
            let productId: number = req.body.id;
            let productName = req.body.name;
            let productPrice = req.body.price;
            let discounts = req.body.discounts;
            this.getEvent(eventId).then((event: any) => {
                this.productModel.one({
                    id: productId,
                }, function (err: Error, product: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_INSERTION);
                        return res.status(500).send(errorMsg);
                    } else {
                        let discountPromises: any = discounts.map((discount: any) => {
                            if (!discount.id) {
                                return self.createDiscount(product, discount);
                            } else {
                                return self.updateDiscount(product, discount);
                            }

                        });
                        Promise.all(discountPromises).then((promises: any) => {
                            return res.status(204).send();
                        }).catch((err: APIError) => {
                            return res.status(err.statusCode).send(err.message);
                        });
                        /* event.addProducts(prod, function (err: Error) {
                             if (err) {
                                 return res.status(500).send("ERROR: Adding product to event failed");
                             } else {
                                 return res.status(204).send();
                             }
                         });*/
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        /**
        * @api {post} api/events/:event/organization Adds organization for event.
        * @apiName Add organization for event
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiParam {JSON} name {name: "Sotahuuto-yhdistys Ry"}
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        * @apiError DatabaseReadError ERROR: Organization data could not be read from the database
        * @apiError NotFound ERROR: Event was not found
        * @apiError NotFound ERROR: Organization was not found
        * @apiError DatabaseInsertionError ERROR: Organization insertion failed
        */
        public setOrganization = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;
            let organizationName = req.body.name;

            this.getEvent(eventId).then((event: any) => {
                this.organizationService.getOrganization(organizationName).then((organization: any) => {
                    event.setOrganization(organization, function (err: Error) {
                        if (err) {
                            let msg = ErrorHandler.getErrorMsg("Organizer", ErrorType.DATABASE_INSERTION);
                            return res.status(500).send(err.message);
                        } else {
                            let jsonData = { data: { organization: organization } };
                            return res.status(200).json(jsonData);
                        }
                    });
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }
        //TODO apidoc
        public openRegisteration = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;

            this.getEvent(eventId).then((event: any) => {
                event.registerationOpen = true;
                event.save(function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Organizer", ErrorType.DATABASE_INSERTION);
                        return res.status(500).send(err.message);
                    } else {
                        return res.status(200).json(JSON.stringify({ "registerationOpen": event.registerationOpen }));
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }
        //TODO apidoc
        public closeRegisteration = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;

            this.getEvent(eventId).then((event: any) => {
                event.registerationOpen = false;
                event.save(function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Organizer", ErrorType.DATABASE_INSERTION);
                        return res.status(500).send(err.message);
                    } else {
                        return res.status(200).json(JSON.stringify({ "registerationOpen": event.registerationOpen }));
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }
        /**
        * @api {post} api/events/:event/group Adds participantgroup to event
        * @apiName Add participantgroup to event
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiParam {JSON} name {name: "testiryhmä"}
        * @apiParam {JSON} description {description: "Joku ryhmä"}
        * @apiParam {JSON} platoonId {platoonId: 1}
        * @apiSuccess (200) Group identified by group.Id
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        * @apiError DatabaseInsertionError ERROR: ParticipantGroup insertion failed
        * @apiError NotFound ERROR: Event was not found
        * @apiError DatabaseUpdateError ERROR: Event update failed
        */
        public addParticipantGroup = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;
            let newGroup = req.body.group;
            let platoonId = newGroup.platoonId;
            let moderator = req.body.moderator;
            let self = this;

            this.getEvent(eventId).then((event: any) => {
                return this.getEventPlatoon(event, platoonId);
            }).then((platoon: any) => {
                if (platoon) {
                    let createdGroup: any = {};
                    this.createGroup(newGroup)
                        .then((group: any) => {
                            createdGroup = group;
                            return this.addGroupToPlatoon(platoon, group);
                        })
                        .then((group: any) => {
                            return this.createGroupPayment();
                        })
                        .then((groupPayment: any) => {
                            return this.setPayeeToPayment(groupPayment, createdGroup);
                        })
                        .then((group: any) => {
                            return this.userService.getUser(moderator);
                        })
                        .then((user: any) => {
                            createdGroup.addModerator(user, (err: Error) => {
                                console.log("Set " + user.email + " to be moderator of group " + createdGroup.name);
                                return err
                                    ? res.status(500).send(ErrorHandler.getErrorMsg("Moderator", ErrorType.DATABASE_UPDATE))
                                    : res.status(200).json(createdGroup);
                            });
                        })
                        .catch((err: APIError) => {
                            return res.status(err.statusCode).send(err.message);
                        });
                } else {
                    return res.status(404).send(ErrorHandler.getErrorMsg("Platoon", ErrorType.NOT_FOUND));
                }
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        private getEventPlatoon = (event: any, platoonId: number) => {
            return new Promise((resolve, reject) => {
                event.getPlatoons((err: Error, platoons: Array<any>) => {
                    if (err) {
                        reject(err);
                    } else {
                        let platoon = this.findPlatoon(platoons, platoonId);
                        resolve(platoon);
                    }
                });
            });
        }

        private findPlatoon = (platoons: any[], platoonId: number) => {
            let values = platoons.filter(p => p.id === platoonId);
            let platoon = values.length > 0 ? values[0] : null;

            return platoon;
        }

        private addGroupToPlatoon = (platoon: any, group: any) => {
            return new Promise((resolve, reject) => {
                platoon.addParticipantGroups(group, (err: Error) => {
                    err ? reject(err) : resolve(group);
                });
            });
        }

        private createGroup = (newGroup: any) => {
            return new Promise((resolve, reject) => {
                this.participantGroupModel.create({
                    name: newGroup.name,
                    description: newGroup.description !== undefined ? newGroup.description : ""
                }, (err: Error, group: any) => {
                    err ? reject(err) : resolve(group);
                });
            });
        }

        private createGroupPayment = () => {
            return new Promise((resolve, reject) => {
                this.groupPaymentModel.create({
                    paidOn: null,
                    referenceNumber: bankUtils.generateFinnishRefNumber(config.get("ref_number_initial"))
                }, (err: Error, payment: any) => {
                    err ? reject(err) : resolve(payment);
                });
            });
        }

        private setPayeeToPayment = (payment: any, payee: any) => {
            return new Promise((resolve, reject) => {
                payment.setPayee(payee, function (err: Error) {
                    err ? reject(err) : resolve(payee);
                });
            });
        }

        /**
        * @api {get} api/events/:id Get detailed information about the event
        * @apiName Get detailed information about the event
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiSuccess (200) -
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        * @apiError DatabaseReadError ERROR: ParticipantGroup data could not be read from the database
        * @apiError NotFound ERROR: Event was not found
        */
        public getEventDetails = (req: express.Request, res: express.Response) => {
            let id = req.params.event;
            this.getEvent(id).then((event: any) => {
                event.getPlatoons(function (err: Error, platoons: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Event platoon data", ErrorType.DATABASE_READ);
                        return res.status(500).send(errorMsg);
                    } else {
                        //console.log(platoons);
                        return res.status(200).json({ data: { event: event, platoons: platoons } });
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }
        /**
        * @api {post} api/events/:event/platoon Adds a platoon to event
        * @apiName Add platoon to event
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiParam {JSON} name {name: "Ruotsi"}
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        * @apiError NotFound ERROR: Event was not found
        * @apiError DatabaseInsertionError ERROR: Platoon insertion failed
        */

        public addPlatoons = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;
            let platoons = req.body.platoons;
            let self = this;

            self.getEvent(eventId).then((event: any) => {
                return new Promise((resolve, reject) => {
                    let platoonList = new Array();
                    for (let platoon of platoons) {
                        self.createPlatoon(eventId, platoon).then(platoon => {
                            platoonList.push(platoon);
                            if (platoonList.length === platoons.length) {
                                return resolve(platoonList);
                            }
                        }).catch((err: APIError) => {
                            return reject(err);
                        });
                    }
                });
            }).then((platoonList: any) => {
                return res.status(200).json(platoonList);
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }
        public updatePlatoon = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;
            let platoonId = req.body.id;
            let platoonName = req.body.name;
            let self = this;

            self.getEvent(eventId).then((event: any) => {
                return new Promise((resolve, reject) => {
                    this.platoonModel.one({
                    id: platoonId,
                }, function (err: Error, platoon: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_INSERTION);
                        return res.status(500).send(errorMsg);
                    } else {
                        platoon.name = platoonName;
                        platoon.save(function(err: Error) {
                            if (err) {
                                let msg = ErrorHandler.getErrorMsg("Organizer", ErrorType.DATABASE_INSERTION);
                                return res.status(500).send(err.message);
                            } else {
                                return res.status(200).json(JSON.stringify(platoon));
                            }
                        });
                    }
                });
            });
            }).then((platoon: any) => {
                return res.status(200).json(platoon);
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        private getProduct = (productId: Number) => {
            return new Promise((resolve, reject) => {
                this.productModel.one({ id: productId }, function (err: Error, product: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!product) {
                        let errorMsg = ErrorHandler.getErrorMsg("Product", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(product);
                    }
                });
            });
        }

        private getEvent = (eventId: Number) => {
            return new Promise((resolve, reject) => {
                this.eventModel.one({ id: eventId }, function (err: Error, event: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!event) {
                        let errorMsg = ErrorHandler.getErrorMsg("Event", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(event);
                    }
                });
            });
        };

        private createPlatoon = (eventId: number, platoon: Platoon) => {
            let self = this;
            return new Promise((resolve, reject) => {
                self.platoonModel.create({
                    name: platoon.name
                }, function (err: Error, platoon: any) {
                    if (err || !platoon) {
                        console.log(err);
                        let errorMsg = ErrorHandler.getErrorMsg("Platoon data", ErrorType.DATABASE_INSERTION);
                        reject(new DatabaseError(500, errorMsg));
                    } else {
                        self.getEvent(eventId).then((event: any) => {
                            event.addPlatoons([platoon], function (err: Error) {
                                if (err) {
                                    let msg = ErrorHandler.getErrorMsg("ParticipantGroup", ErrorType.DATABASE_INSERTION);
                                    return reject(new DatabaseError(500, msg));
                                } else {
                                    return resolve(platoon);
                                }
                            });
                        }).catch((err: APIError) => {
                            return reject(err);
                        });
                    }
                });
            });
        }
        private createDiscount = (product: any, discount: any) => {
            let self = this;
            return new Promise((resolve, reject) => {
                self.discountModel.create({
                    name: discount.name,
                    amount: discount.amount
                }, function (err: Error, discount: any) {
                    if (err || !discount) {
                        console.log(err);
                        let errorMsg = ErrorHandler.getErrorMsg("Discount", ErrorType.DATABASE_INSERTION);
                        reject(new DatabaseError(500, errorMsg));
                    } else {
                        discount.setProduct(product, function (err: Error) {
                            if (err) {
                                let msg = ErrorHandler.getErrorMsg("Discount", ErrorType.DATABASE_INSERTION);
                                return reject(new DatabaseError(500, msg));
                            } else {
                                console.log(JSON.stringify(product));
                                return resolve(discount);
                            }
                        });
                    }
                });
            });
        }
        private updateDiscount = (product: any, newDiscount: any) => {
            let self = this;
            return new Promise((resolve, reject) => {
                self.discountModel.find({
                    id: newDiscount.id
                }, function (err: Error, discount: any) {
                    if (err || !discount) {
                        console.log(err);
                        let errorMsg = ErrorHandler.getErrorMsg("Discount", ErrorType.DATABASE_INSERTION);
                        reject(new DatabaseError(500, errorMsg));
                    } else {
                        resolve(discount);
                        /*console.log("Before saving");
                        console.log(JSON.stringify( discount));
                        discount.name = newDiscount.name;
                        discount.amount = newDiscount.amount;
                        console.log("Trying to save");
                        console.log(JSON.stringify( discount));
                        console.log("With this data");
                        console.log(JSON.stringify(newDiscount));
                        //The Discount need to be updated here, will be done on a later date
                        // The orm is causing wierd behaviour at the moment
                        discount.save(function(err: Error, discount: any){
                             err ?
                             reject(new DatabaseError(500, ErrorHandler.getErrorMsg("Discount", ErrorType.DATABASE_INSERTION))) :
                             resolve(discount);
                        });*/
                    }
                });
            });
        }

        private getPlatoon = (platoonId: number) => {
            return new Promise((resolve, reject) => {
                this.platoonModel.one({ id: platoonId }, function (err: Error, platoon: any) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Platoon", ErrorType.NOT_FOUND);
                        return reject(new DatabaseError(500, msg));
                    } else {
                        return resolve(platoon);
                    }
                });
            });
        }
    }
}

export = Route;