import * as express from "express";
import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Route {

    class Event {
        constructor(private id: number,
                    private name: string,
                    private startDate: Date,
                    private endDate: Date,
                    private description: string,
                    private registerationOpen: boolean) {}
    }
    class Product {
        name: string;
        price: string;
    }
    class Discount {
        name: string;
        amount: string;
    }
    export class EventRoutes {
        constructor(private eventModel: any, private productModel: any, private userService: UserService) {

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
                    return res.status(204).send();
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
                    let eventList: Event[] = new Array<Event>();
                    console.log("The eventlist contains: ");
                    for (let event of events){
                        eventList.push(new Event(event.id,
                                                 event.name,
                                                 event.startDate,
                                                 event.endDate,
                                                 event.description,
                                                 event.registerationOpen ));
                    }
                    return res.status(200).json(eventList);
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
                            return res.status(200).send(prods);
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
        * @apiSuccess (204) -
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
        * @api {post} api/events/:event/organizer Adds event organizer
        * @apiName Add event organizer
        * @apiGroup Event
        * @apiParam {Number} event Events unique ID
        * @apiParam {JSON} username {username: "user@gmail.com"}
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Event data could not be read from the database
        * @apiError DatabaseReadError ERROR: User data could not be read from the database
        * @apiError NotFound ERROR: Event was not found
        * @apiError NotFound ERROR: User was not found
        * @apiError DatabaseInsertionError ERROR: Organizer insertion failed
        */
        public addOrganizer = (req: express.Request, res: express.Response) => {
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
    }
}

export = Route;