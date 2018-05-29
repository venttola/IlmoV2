"use strict";
import * as express from "express";
//import Promise from "ts-promise";
import * as bcrypt from "bcrypt";
var ibantools = require("ibantools");

import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

/*
	
	POST /api/organization
	*/
module Route {
	export class OrganizationRoutes {
		constructor(
			private userService: UserService,
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

			if (!ibantools.isValidIBAN(req.body.bankAccount)) {
				let errorMsg = ErrorHandler.getErrorMsg("Organization data", ErrorType.DATABASE_INSERTION);
				return res.status(500).send(errorMsg);
			}
			this.organizationModel.create({
				name: req.body.name,
				bankAccount: req.body.bankAccount,
			}, function (err: Error, organization: any) {
				console.log("organization: " + organization);

				if (err) {
					let errorMsg = ErrorHandler.getErrorMsg("Organization data", ErrorType.DATABASE_INSERTION);
					return res.status(500).send(errorMsg);
				} else {
					return res.status(200).json({ data: { organization: organization } });
				}
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

			let organizationId = req.params.organization;
			let newMembers: any = req.body.members;
			new Promise((resolve, reject) => {
				let memberList = new Array();
				for (let user of newMembers) {
					this.userService.getUser(user.id).then((user: any) => {
						user.addOrganizations(organizationId, function (err: any) {
							if (err) {
								let errorMsg = ErrorHandler.getErrorMsg("Organization data", ErrorType.NOT_FOUND);
								reject(new DatabaseError(500, errorMsg));
							} else {
								memberList.push(user);
								if (memberList.length === newMembers.length) {
									resolve(memberList);
								}
							}
						});
					}).catch((err: APIError) => {
						console.log("err: " + err);
						reject(err);
					});
				}
			}).then((memberList: any) => {
				return res.status(200).json(JSON.stringify({ data: { members: memberList } }));
			}).catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}
	}
}

export = Route;