"use strict";

import * as express from "express";
import Promise from "ts-promise";
import * as bcrypt from "bcrypt";
import { DatabaseHandler } from "../models/databasehandler";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

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
		constructor(private userModel: any, private productModel: any, private saltRounds: number) {

		}

		public setUserCredentials = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let userEmail = req.params.username;
			let oldPassword = req.body.oldPassword;
			let newPassword = req.body.newPassword;
			let saltRounds = this.saltRounds;

			this.getUser(userEmail).then((user: any) => {
				bcrypt.compare(oldPassword, user.password, function(err: Error, success: any) {
					if (success) {
						bcrypt.hash(newPassword, saltRounds, function(err: Error, hash: any) {
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
					}
				});
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		public getUserInfo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			this.getUser(req.params.username).then((user: any) => {
				let userData = user;
				userData.password = undefined; // Delete doesn't work with node-orm
				return res.status(200).send(JSON.stringify(userData));
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		public setUserInfo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			this.getUser(req.params.username).then((user: any) => {
				// TODO: Validation?
				user.firstname = req.body.firstName;
				user.lastname = req.body.lastName;
				user.dob = new Date(req.body.dob);
				user.allergies = req.body.allergies;

				user.save(function(err: Error){
					if (!err) {
						return res.status(204).send();
					} else {
						console.log(err);
						return res.status(500).send("User details update failed");
					}
				});
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		public getProducts = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			this.getUser(req.params.username).then((user: any) => {
				user.getProducts(function(err: Error, prods: any) {
					if (err) {
						let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_READ);
						return res.status(500).send(errorMsg);
					} else {
						return res.status(200).send(prods);
					}
				});
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		public addProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let productId = req.body.productId; // Assuming that products are added one at a time

			this.getUser(req.params.username).then((user: any) => {
				this.productModel.one({id: productId}, function(err: Error, product: any) {
					if (err) {
						let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_READ);
						return res.status(500).send(errorMsg);
					} else if (!product) {
						let errorMsg = this.errorMessage("Product", ErrorType.NOT_FOUND);
						return res.status(400).send(errorMsg);
					} else {
						user.addProducts(product, function(err: Error) {
							if (err) {
								console.log(err);
								return res.status(500).send("ERROR: Product update failed");
							} else {
								return res.status(204).send();
							}
						});
					}
				});
			});
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

		private getUser = (username: String) => {
			return new Promise((resolve, reject) => {
				this.userModel.one({email: username}, function(err: Error, user: any) {
					console.log(user);
					if (err) {
						let errorMsg = ErrorHandler.getErrorMsg("User data", ErrorType.DATABASE_READ);
						reject(new DatabaseError(500, errorMsg));
					} else if (!user) {
						let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
						reject(new DatabaseError(400, errorMsg));
					} else {
						return resolve(user);
					}
				});
			});
		};
	}
}

export = Route;