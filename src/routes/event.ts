import * as express from "express";
import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Route {
    export class EventRoutes {
        constructor(private eventModel: any, private productModel: any, private userService: UserService) {

        }

        public addEvent = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.eventModel.create({
                name: req.body.name,
                startdate: new Date(req.body.startDate),
                description: req.body.description
            }, function (err: Error, items: any) {
                if (err) {
                    let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_INSERTION);
                    return res.status(500).send(errorMsg);
                } else {
                    return res.status(204).send();
                }
            });
        }

        public getEvents = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.eventModel.all(function (err: Error, events: any) {
                if (err) {
                    let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_READ);
                    return res.status(500).send(errorMsg);
                } else {
                    return res.status(200).send(events);
                }
            });
        }

        public getEventProducts = (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
                            return res.status(200).send(prods);
                        }
                    });
                }
            });
        }

        public addProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
                                return res.status(500).send("Adding product to event failed");
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

        public addOrganizer = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let eventId = req.params.event;
            let username = req.body.username;

            Promise.all([this.getEvent(eventId), this.userService.getUser(username)]).then(values => {
                let event: any = values[0];
                let user: any = values[1];

                event.addOrganizers(user, function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Organizer", ErrorType.DATABASE_INSERTION);
                        return res.status(500).send(msg);
                    } else {
                        return res.status(204).send();
                    }
                });
            });



            /*
            this.getEvent(eventId).then((event: any) => {
                this.userService.getUser(username).then((user) => {

                });
                //event.addOrganizers()
            })..catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
            */
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
    }
}

export = Route;