"use strict";
import * as express from "express";
//import Promise from "ts-promise";
import * as bcrypt from "bcrypt";
var ibantools = require("ibantools");

import { UserService } from "../services/userservice";
import { OrganizationService } from "../services/organizationservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Route {
	export class OrganizationRoutes {
		constructor(
			private userService: UserService,
      private organizationService: OrganizationService,
			private organizationModel: any) {

		}

		/**
    * @api {post} api/organizations/ Adds new organization to the database
    * @apiName signup
    * @apiGroup Login
    * @apiParam {JSON} name {name: "Sotahuuto-yhdistys Ry"}
    * @apiParam {JSON} dob {bankAccount: "FI4250001510000023"}
    * @apiSuccess -
    * @apiError {JSON} Missing fields or erroneus IBAN account number
    */
		public addOrganization = (req: express.Request, res: express.Response) => {
			console.log(req.body);
			this.organizationService.createOrganization(req.body.name, req.body.bankAccount)
			.then((organization: any) => {
				return res.status(200).json(organization);
			}).catch((err: any)=> {
				return res.status(500).send(err);
			});
		}
    /**
    * @api {get} api/organizations Lists all organizations
    * @apiName List organizations
    * @apiGroup Organization
    * @apiSuccess {JSON} List of organization
    * @apiError DatabaseReadError ERROR: Organization data could not be read from the database
    */
		public getOrganizations = (req: express.Request, res: express.Response) => {
			this.organizationModel.all(function (err: Error, organizations: any) {
				if (err) {
					let errorMsg = ErrorHandler.getErrorMsg("Organization data", ErrorType.DATABASE_READ);
					return res.status(500).send(errorMsg);
				} else {
					return res.status(200).json(organizations);
				}
			});
		}
    /**
    * @api {post} api/organizations/organization/members Adds new user to the database
    * @apiName signup
    * @apiGroup Login
    * @apiParam {JSON} name {name: "Sotahuuto-yhdistys Ry"}
    * @apiParam {JSON} dob {bankAccount: "FI4250001510000023"}
    * @apiSuccess -
    * @apiError {JSON} Missing fields or erroneus IBAN account number
    */
		public addOrganizationMembers = (req: express.Request, res: express.Response) => {
			console.log("adding members");

			let organizationId = req.params.id;
			let newMembers: any = req.body.members;
			this.organizationService.addMembers(organizationId, newMembers)
			.then((memberList: any) => {
				return res.status(200).json(JSON.stringify({ data: { members: memberList } }));
			}).catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}
    public getEvents = (req: express.Request, res: express.Response) => {
      let organizationId = req.params.id;
      this.organizationService.getEvents(organizationId).then((events: any) => {
        return res.status(200).json(events);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    public getEventOverview = (req: express.Request, res: express.Response) => {
      let organizationId = req.params.id;
      let eventId = req.params.eventId;
      this.organizationService.getEventOverview(organizationId, eventId).then((overview: any) => {
        return res.status(200).json(overview);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
    public getGroupListing = (req: express.Request, res: express.Response) => {
      let organizationId = req.params.id;
      let eventId = req.params.eventId;
      this.organizationService.getGroups(organizationId, eventId).then((platoons: any) => {
        return res.status(200).json(platoons);
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
	}
}

export = Route;