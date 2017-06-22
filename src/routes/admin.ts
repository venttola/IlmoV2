"use strict";

import * as express from "express";
//import Promise from "ts-promise";
import * as bcrypt from "bcrypt";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { EventService } from "../services/eventservice";
import { GroupService } from "../services/groupservice";
import { AdminService } from "../services/adminservice";

import { uniq, flatten, contains } from "underscore";

module Route {
	export class AdminRoutes {
		constructor(
			private userService: UserService,
			private eventService: EventService,
			private groupService: GroupService,
			private adminService: AdminService,
			private saltRounds: number
		) {

		}

		/**
        * @api {patch} /api/admin/users/resetpassword/:username/ Reset user password 
        * @apiName Reset user password
        * @apiGroup User
        * @apiParam {String} username Username
        * @apiParam {JSON} password {password: "old password"}
        * @apiParam {JSON} password {password: "new password"}
        * @apiSuccess (204) -
        * @apiError NotFound ERROR: User was not found
		* @apiError PasswordMismatch Credential update failed
		* @apiError HashCalculationError Hash calculation failed
        * @apiError DatabaseUpdateError Password update failed
        */
		public resetUserPassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let userEmail = req.params.username;
			let password = req.body.password;
			let rePassword = req.body.rePassword;
			//Check that these two match!
			let saltRounds = this.saltRounds;
			this.userService.getUser(userEmail).then((user: any) => {
				if (user) {
					bcrypt.hash(password, saltRounds, function (err: Error, hash: any) {
						if (!err) {
							user.password = hash;
							user.save(function (err: Error) {
								if (!err) {
									return res.status(204).send();
								} else {
									return res.status(500).send("Error: Password reset failed");
								}
							});
						} else {
							return res.status(500).send("Error: Password reset failed");
						}
					});
				} else {
					return res.status(404).send("Error: User not found");
				}
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}
		/** Not working yet!
        */
		public getAllUsers = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let query: string = req.params.query;
			this.adminService.getAllUsers(query).then((users: any) => {
				return res.status(200).send(JSON.stringify(users));
			}).catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}
	}
}

export = Route;