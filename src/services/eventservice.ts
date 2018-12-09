//import Promise from "ts-promise";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
  export class EventService {
    constructor(private eventModel: any) { }

    public getEventProducts = (eventId: number) => {
      return new Promise((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          event.getProducts(function (err: Error, prods: any) {
            if (err) {
              let errorMsg = ErrorHandler.getErrorMsg("Event product data", ErrorType.DATABASE_READ);
              reject(new DatabaseError(500, errorMsg));
            } else {
              resolve(prods);
            }
          });
        });
      });
    };

    public isEventRegistrationOpen = (eventId: number) => {
      return new Promise((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          resolve(event.registerationOpen);
        });
      });
    }

    public getEvent = (eventId: number) => {
      return new Promise((resolve, reject) => {
        this.eventModel.one({ id: eventId }, function (err: Error, event: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_READ);
            reject(new DatabaseError(500, errorMsg));
          } else if (!event) {
            let errorMsg = ErrorHandler.getErrorMsg("Event", ErrorType.NOT_FOUND);
            reject(new DatabaseError(404, errorMsg));
          } else {
            resolve(event);
          }
        });
      });
    }
    // TODO: Implement Platoon, group and participant removal.
    public removeEvent = (eventId: number ) => {
      return new Promise ((resolve, reject) => {
        this.getEvent(eventId).then((event: any) => {
          event.remove(function (err: Error) {
            if (err) {
              let msg = ErrorHandler.getErrorMsg("Event", ErrorType.DATABASE_DELETE);
              reject(new DatabaseError(500, msg));
            } else {
              resolve(event);
            }
          });
        }).catch((err: DatabaseError) => {
          reject(err);
        });
      });
    }
    public createEvent = (name: string,
      startDate: string,
      endDate: string,
      description: string,
      registerationOpen: boolean) => {
      return new Promise((resolve, reject) => {
        this.eventModel.create({
          name: name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          description: description,
          registerationOpen: registerationOpen
        }, function (err: Error, event: any) {
          if (err) {
            let errorMsg = ErrorHandler.getErrorMsg("Event data", ErrorType.DATABASE_INSERTION);
            return reject(new DatabaseError(500, errorMsg));
          } else {
            return resolve(event);
          }
        });
      });
    }

  }
}

export = Service;