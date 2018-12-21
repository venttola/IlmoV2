import * as express from "express";
import * as config from "config";
const bankUtils = require("finnish-bank-utils");
//import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { OrganizationService } from "../services/organizationservice";
import { EventService } from "../services/eventservice";
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
      private discountModel: any,
      private platoonModel: any,
      private participantGroupModel: any,
      private groupPaymentModel: any,
      private userService: UserService,
      private organizationService: OrganizationService,
      private eventService: EventService) {
    }

    /**
    * @api {post} api/events Adds new event
    * @apiName New event
    * @apiGroup Event
    * @apiParam {JSON} name {name: "Event name"}
    * @apiParam {JSON} startDate {startDate: "2017-01-01T12:00:00+0200"}
    * @apiParam {JSON} endDate {endDate: "2017-01-02T12:00:00+0200"}
    * @apiSuccess (201) -
    * @apiError DatabaseInsertionError ERROR: Event data insertion failed
    */
    public addEvent = (req: express.Request, res: express.Response) => {
      this.eventService.createEvent(req.body.name,
        req.body.startDate,
        req.body.endDate,
        req.body.description,
        req.body.registerationOpen)
      .then((event: any) => {
        return res.status(201).json({event: event});
      })
      .catch((err: DatabaseError) => {
        return res.status(err.statusCode).send(err.message);
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
      this.eventService.removeEvent(eventId)
      .then((event: any) => {
        res.status(200);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }

    /**
    * @api {get} api/events Lists all events
    * @apiName List events
    * @apiGroup Event
    * @apiSuccess (200) {JSON} List of events
    * @apiError DatabaseReadError ERROR: Event data could not be read from the database
    */
    public getEvents = (req: express.Request, res: express.Response) => {
      this.eventService.getAllEvents()
      .then((events: any) => {
        return res.status(200).json(events);
      }).catch((err: APIError) => {
         return res.status(err.statusCode).send(err.message);
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
      this.eventService.getEventProducts(eventId)
      .then((products: any) => {
        return res.status(200).json(products);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
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
    * @apiSuccess (201) JSON {id: 1, name: "Product name", price: "Product price"}
    * @apiError DatabaseInsertionError ERROR: Product data insertion failed
    * @apiError NotFound ERROR: Event was not found
    * @apiError DatabaseInsertionError ERROR: Adding product to event failed
    * @apiError DatabaseReadError ERROR: Event data could not be read from the database
    */
    public addProduct = (req: express.Request, res: express.Response) => {
      console.log("Adding product");
      console.log("Body: " + JSON.stringify(req.body));
      let eventId = req.params.event;
      let productData = {
        name: req.body.name,
        price: req.body.price,
        discounts: req.body.discounts
      };
      this.eventService.addProductFor(eventId, productData)
      .then((product: any) => {
        res.status(201).send(product);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }

    /**
    * @api {patch} api/events/:event/product Updates product details
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
      let productData = {
        name: req.body.name,
        price: req.body.price,
        discounts: req.body.discounts
      };
      this.eventService.updateProduct(productId, productData)
      .then((product: any) => {
        res.status(201).send(product);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }

    /**
    * @api {post} api/events/:event/organization Sets organization for event.
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

      this.eventService.getEvent(eventId).then((event: any) => {
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
    /**
    * @api {post} api/events/:event/opensignup Open signup for event
    * @apiGroup Event
    * @apiParam {Number} event Event's unique ID
    * @apiSuccess (200) -
    * @apiError DatabaseReadError ERROR: Event data could not be read from the database
    * @apiError NotFound ERROR: Event was not found
    */
    public openRegisteration = (req: express.Request, res: express.Response) => {
      let eventId = req.params.event;
      this.eventService.setRegisterationFor(eventId, true)
      .then((event: any) => {
        return res.status(200).json(event);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
      /**
    * @api {post} api/events/:event/closesignup Open signup for event
    * @apiGroup Event
    * @apiParam {Number} event Event's unique ID
    * @apiSuccess (200) -
    * @apiError DatabaseReadError ERROR: Event data could not be read from the database
    * @apiError NotFound ERROR: Event was not found
    */
    public closeRegisteration = (req: express.Request, res: express.Response) => {
      let eventId = req.params.event;

      this.eventService.setRegisterationFor(eventId, false)
      .then((event: any) => {
        return res.status(200).json(event);
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
      let groupData = {
        platoonId: req.body.group.platoonId,
        name: req.body.group.name,
        description: req.body.group.description,
        moderator: req.body.moderator
      };
      this.eventService.createParticipantGroup(eventId, groupData)
      .then((group: any) => {
        return res.status(201).json(group);
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
      this.eventService.getEventDetails(id).then((data: any) => {
        return res.status(200).json(data);
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

      self.eventService.createPlatoons(eventId, platoons)
      .then((platoonList: any) => {
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

      this.eventService.getEvent(eventId).then((event: any) => {
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
            this.eventService.getEvent(eventId).then((event: any) => {
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