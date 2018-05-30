//import Promise from "ts-promise";
"use strict";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { EventService } from "./eventservice";
import { GroupService } from "./groupservice";
module Service {
    export class OrganizationService {
        constructor(private eventService: EventService,
                    private groupService: GroupService,
                    private organizationModel: any) { }

        public getOrganization = (id: number) => {
            return new Promise((resolve, reject) => {
                this.organizationModel.get(id, function (err: any, organization: any) {
                    if (!err) {
                        return resolve(organization);
                    } else if (err.literalCode === "NOT_FOUND") {
                        let errorMsg = ErrorHandler.getErrorMsg("organization", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(404, errorMsg));
                    } else {
                        let errorMsg = ErrorHandler.getErrorMsg("Organization data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
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
                }).catch((e: any ) => {
                    reject (e);
                });
            });
        }
    }
}

export = Service;