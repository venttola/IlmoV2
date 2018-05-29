//import Promise from "ts-promise";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
    export class OrganizationService {
        constructor(private organizationModel: any) { }

        public getOrganization = (id: number) => {
            return new Promise((resolve, reject) => {
                this.organizationModel.get(id, function (err: Error, organization: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Organization data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!organization) {
                        let errorMsg = ErrorHandler.getErrorMsg("organization", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(organization);
                    }
                });
            });
        };
        public getEvents = (id: number) => {
            return new Promise((resolve, reject) => {
                return this.getOrganization(id).then((organization: any) => {
                    organization.getEvents(function(err: Error, events: any) {
                        if (err) {
                            let errorMsg = ErrorHandler.getErrorMsg("Organization event data", ErrorType.DATABASE_READ);
                            reject(new DatabaseError(500, errorMsg));
                        } else {
                            //Prune this because of all the autoFetches
                            let prunedEvents = events.map(( e: any) => {
                                return {
                                    name: e.name,
                                    startDate: e.startDate,
                                    endDate: e.endDate,
                                    description: e.description,
                                    registerationOpen: e.registerationOpen,
                                    id: e.id
                                };
                            });
                            resolve(prunedEvents);
                        }
                    });
                });
            });
        }
    }
}

export = Service;