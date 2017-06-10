import * as express from "express";
//import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { OrganizationService } from "../services/organizationservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

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
            console.log("Getting event products");
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
                            console.log(prods);
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
        * @apiSuccess (200) JSON {id: 1, name: "Product name", price: "Product price"}
        * @apiError DatabaseInsertionError ERROR: Product data insertion failed
        * @apiError NotFound ERROR: Event was not found
        * @apiError DatabaseInsertionError ERROR: Adding product to event failed
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        */
        public addProduct = (req: express.Request, res: express.Response) => {
            let eventId = req.params.event;
            let productName = req.body.name;
            let productPrice = req.body.price;
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
                event.getPlatoons(function (err: Error, platoons: Array<any>) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Event platoon data", ErrorType.DATABASE_READ);
                        return res.status(500).send(errorMsg);
                    }

                    let values = platoons.filter(p => p.id === platoonId);
                    let platoon = values.length > 0 ? values[0] : null;

                    if (platoon) {
                        // Create new participant group
                        self.participantGroupModel.create({
                            name: newGroup.name,
                            description: newGroup.description !== undefined ? newGroup.description : "",
                            referenceNumber: 123 // TODO: Generate new number for each group
                        }, (err: Error, group: any) => {

                            if (err) {
                                let errorMsg = ErrorHandler.getErrorMsg("Group data", ErrorType.DATABASE_INSERTION);
                                return res.status(500).send(errorMsg);
                            }

                            // Add new group to platoon
                            platoon.addParticipantGroups(group, function (err: Error) {
                                if (err) {
                                    return res.status(500).send(ErrorHandler.getErrorMsg("Platoon", ErrorType.DATABASE_UPDATE));
                                } else {

                                    // Create a group payment model
                                    self.groupPaymentModel.create({
                                        paidOn: null
                                    }, function (err: Error, payment: any) {
                                        if (err != null) {
                                            return res.status(500).send(ErrorHandler.getErrorMsg("GroupPayment", ErrorType.DATABASE_UPDATE));
                                        } else {

                                            // Set the group to be the payee
                                            payment.setPayee(group, function (err: Error) {
                                                if (err) {
                                                    return res.status(500).send(ErrorHandler.getErrorMsg("Platoon", ErrorType.DATABASE_UPDATE));
                                                } else {

                                                    // Set the creator user to be the initial moderator of the group
                                                    self.userService.getUser(moderator).then((user: any) => {
                                                        if (!user) {
                                                            return res.status(500).send(ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND));
                                                        } else {
                                                            group.addModerator(user, (err: Error) => {
                                                                console.log("Set " + user.email + " to be moderator of group " + group.name);
                                                                return err != null
                                                                    ? res.status(500)
                                                                        .send(ErrorHandler.getErrorMsg("Moderator", ErrorType.DATABASE_UPDATE))
                                                                    : res.status(200).json(group);
                                                            });
                                                        }
                                                    }).catch((err: APIError) => {
                                                        return res.status(err.statusCode).send(err.message);
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        return res.status(404).send(ErrorHandler.getErrorMsg("Platoon", ErrorType.NOT_FOUND));
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
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