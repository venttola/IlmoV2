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
                           // console.log(JSON.stringify(events));
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
                            //console.log(prunedEvents);
                            resolve(prunedEvents);
                        }
                    });
                }).catch((e: any ) => {
                    reject(e);
                });
            });
        }
        public getEventOverview = (organizationId: number, eventId: number ) => {
            let self = this;
            return new Promise((resolve, reject) => {
                this.getOrganization(organizationId).then((organization: any) => {
                    this.eventService.getEvent(eventId).then((event: any) => {
                        let platoonPromises = event.platoons.map((platoon: any) => {
                            return new Promise((resolve, reject) => {
                                platoon.getParticipantGroups((err: Error, groups: any) => {
                                    if (err) {
                                        let errorMsg = ErrorHandler.getErrorMsg("Organization event data", ErrorType.DATABASE_READ);
                                        reject(new DatabaseError(500, errorMsg));
                                    }
                                    let sumPromises = groups.map((group: any) => {
                                        return new Promise((resolve, reject) => {
                                            this.groupService.getProductSums(group.id).then((sums: any) => {
                                                resolve ({name: group.name, products: sums});
                                            });
                                        });
                                    });
                                    //No idea why this nees the dueal promise unwapping
                                    Promise.all([sumPromises]).then((result: any) => {
                                        return Promise.all(result[0]).then((promises: any) => {
                                            resolve(promises);
                                        });
                                    });
                                });
                            });
                        });
                        //No idea why this nees the dueal promise unwapping
                        Promise.all([event, platoonPromises]).then((result: any) => {
                            Promise.all(result[1]).then((groups: any) => {
                                resolve({event: event, groups: groups});
                            });
                        });
                    }).catch((e: any ) => {
                        reject(e);
                    });
                });
            });
        }
    }
}

export = Service;