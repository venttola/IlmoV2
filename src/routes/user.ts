"use strict";

import * as express from "express";
import * as bcrypt from "bcrypt";
import { DatabaseHandler } from "../models/databasehandler";

/*
	GET /api/user/:username 
	PATCH /api/user/:username/credentials 
	PATCH /api/user/:username/detail
	GET /api/user/:username/products
	POST /api/user/:username/product
	DELETE /api/user/:username/product
	POST /api/user/:username/group
	DELETE /api/user/:username/group
*/
module Route {
	export class UserRoutes {
		constructor(private userModel: any, private saltRounds: number) {

		}

		public setUserCredentials = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let userEmail = req.params.username;
			let oldPassword = req.body.oldPassword;
			let newPassword = req.body.newPassword;

			console.log("UserEmail: " + userEmail);
			console.log("Old: " + oldPassword);
			console.log("New: " + newPassword);

			let saltRounds = this.saltRounds;

			this.userModel.one({email: userEmail}, function(err: Error, user: any) {
				if (user) {
					bcrypt.compare(oldPassword, user.password, function(err: any, success: any) {
						if (success) {
							bcrypt.hash(newPassword, saltRounds, function(err: any, hash: any) {
								if (!err) {
									user.password = hash;

									user.save(function(err: Error){
										if (!err) {
											return res.status(204).send();
										} else {
											return res.status(500).send("Password update failed");
										}
									});
								} else {
									console.log("Hash calculation failed", err);
								}
							});
						} else if (!success) {
							return res.status(403).send("Error: Incorrect password!\n");
						} else if (err) {
							console.log(err);
							return res.status(500).send("Error calculating hash");
						}
					});
				} else if (err) {
					console.log("User data could not be fetched: " + err);
				} else if (!user) {
					return res.status(400).send("Error: Username not found!\n");
				}
			});
		}

		public getUserInfo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			this.userModel.one({email: req.params.username}, function(err: Error, user: any) {
				if (err) {
					let errorMsg = "User data could not be fetched";
					console.log(errorMsg, err);
					return res.status(500).send(errorMsg);
				} else if (!user) {
					return res.status(400).send("Error: Username not found!\n");
				} else {
					let userData = user;
					userData.password = undefined; // Delete doesn't work with node-orm
					return res.status(200).send(JSON.stringify(userData));
				}
			});
		}

		public setUserInfo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public getProducts = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public addProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public removeProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public addGroup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public removeGroup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}
	}
}

export = Route;