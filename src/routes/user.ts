"use strict";

import * as express from "express";
import Promise from "ts-promise";
import * as bcrypt from "bcrypt";
import { DatabaseHandler } from "../models/databasehandler";
import { UserService } from "../services/userservice";
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
		constructor(private userService: UserService, private productModel: any,
			private participantGroupModel: any, private saltRounds: number) {

		}

		/**
        * @api {patch} /api/user/:username/credentials Update user credentials
        * @apiName Update user credentials
        * @apiGroup User
        * @apiParam {String} username Username
        * @apiParam {JSON} password {password: "old password"}
        * @apiParam {JSON} newPassword {newPassword: "new password"}
        * @apiSuccess (204) -
        * @apiError NotFound ERROR: User was not found
		* @apiError PasswordMismatch Credential update failed
		* @apiError HashCalculationError Hash calculation failed
        * @apiError DatabaseUpdateError Password update failed
        */
		public setUserCredentials = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let userEmail = req.params.username;
			let oldPassword = req.body.password;
			let newPassword = req.body.newPassword;
			let saltRounds = this.saltRounds;
			console.log("Updating pasword");
			this.userService.getUser(userEmail).then((user: any) => {
				bcrypt.compare(oldPassword, user.password, function(err: Error, success: any) {
					if (success) {
						console.log("Passwords match");
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
								return res.status(500).send("Hash calculation failed");
							}
						});
					} else {
						console.log("Credential update failed", err);
						return res.status(500).send("Credential update failed");
					}
				});
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		/**
        * @api {patch} /api/user/:username Get user details
        * @apiName Get user details
        * @apiGroup User
        * @apiParam {String} username Username
        * @apiSuccess {JSON} User details
        * @apiError NotFound ERROR: User was not found
        */
		public getUserInfo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			this.userService.getUser(req.params.username).then((user: any) => {
				let userData = user;
				userData.password = undefined; // Delete doesn't work with node-orm
				return res.status(200).send(JSON.stringify(userData));
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		/**
        * @api {patch} /api/user/:username/detail Update user details
        * @apiName Update user details
        * @apiGroup User
        * @apiParam {String} username Username
        * @apiParam {JSON} password {password: "user password"}
        * @apiParam {JSON} firstname {firstname: "firstname"}
		* @apiParam {JSON} lastname {lastname: "lastname"}
		* @apiParam {JSON} date of birth {dob: "2000-01-01"}
		* @apiParam {JSON} allergies {allergies: "celiac disease"}
        * @apiSuccess (204) -
        * @apiError NotFound ERROR: User was not found
		* @apiError PasswordMismatch Userdata update failed
		* @apiError HashCalculationError Hash calculation failed
        * @apiError DatabaseUpdateError User details update failed
        */
		public setUserInfo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			console.log(req.body);
			let userEmail = req.params.username;
			let password = req.body.password;
			console.log("updating userdata");
			this.userService.getUser(userEmail).then((user: any) => {
				bcrypt.compare(password, user.password, function(err: Error, success: any) {
					if (success) {
						user.firstname = req.body.firstname;
						user.lastname = req.body.lastname;
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
					} else {
								console.log("Userdata update failed", err);
								return res.status(500).send("User details update failed");
							}
				}).catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		/**
        * @api {get} /api/user/:username/products Get user products
        * @apiName Get user products
        * @apiGroup User
        * @apiParam {String} username Username
        * @apiSuccess {JSON} List of user products
        * @apiError NotFound ERROR: User was not found
        * @apiError DatabaseReadError Product data could not be read from the database
        */
		public getProducts = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			console.log(req.body);
			this.userService.getUser(req.params.username).then((user: any) => {
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

		/**
        * @api {post} /api/user/:username/product Add user product
        * @apiName Add user product
        * @apiGroup User
        * @apiParam {String} username Username
        * @apiParam {JSON} productId {productId: 1}
        * @apiSuccess (204) -
        * @apiError NotFound ERROR: User was not found
		* @apiError NotFound ERROR: Product was not found
		* @apiError PasswordMismatch Userdata update failed
        * @apiError DatabaseUpdateError ERROR: Product update failed
        */
		public addProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let productId = req.body.productId; // Assuming that products are added one at a time

			this.userService.getUser(req.params.username).then((user: any) => {
				this.getProduct(productId).then((product: any) => {
					user.addProducts(product, function(err: Error) {
						if (err) {
							return res.status(500).send("ERROR: Product update failed");
						} else {
							return res.status(204).send();
						}
					});
				})
				.catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
			});
		}

		/**
        * @api {delete} /api/user/:username/product Remove user product
        * @apiName Remove user product
        * @apiGroup User
        * @apiParam {String} username Username
		* @apiParam {JSON} productId {productId: 1}
        * @apiSuccess (204) -
        * @apiError NotFound ERROR: User was not found
		* @apiError NotFound ERROR: Product was not found
        * @apiError DatabaseDeleteError Product removal failed
        */
		public removeProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let productId = req.body.productId; // Assuming that products are added one at a time

			this.userService.getUser(req.params.username).then((user: any) => {
				this.getProduct(productId).then((product: any) => {
					user.removeProducts([product], function(error: Error) {
						if (error) {
							return res.status(500).send("Product removal failed");
						} else {
							return res.status(204).send();
						}
					});
				})
				.catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		/**
        * @api {post} /api/user/:username/group Add user group
        * @apiName Add user group
        * @apiGroup User
        * @apiParam {String} username Username
        * @apiParam {JSON} groupId {groupId: 1}
        * @apiSuccess (204) -
        * @apiError NotFound ERROR: User was not found
		* @apiError NotFound ERROR: Group was not found
        * @apiError DatabaseUpdateError ERROR: Group update failed
        */
		public addGroup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let groupId = req.body.groupId;

			this.getGroup(groupId).then((group: any) => {
				this.userService.getUser(req.params.username).then((user: any) => {
					group.addMembers(user, function(err: Error) {
						if (err) {
							return res.status(500).send("ERROR: Group update failed");
						} else {
							return res.status(204).send();
						}
					});
				})
				.catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		/**
        * @api {delete} /api/user/:username/group Remove user group
        * @apiName Remove user group
        * @apiGroup User
        * @apiParam {String} username Username
		* @apiParam {JSON} groupId {groupId: 1}
        * @apiSuccess (204) -
        * @apiError NotFound ERROR: User was not found
		* @apiError NotFound ERROR: Group was not found
        * @apiError DatabaseUpdateError ERROR: Group update failed
        */
		public removeGroup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let groupId = req.body.groupId;

			this.getGroup(groupId).then((group: any) => {
				this.userService.getUser(req.params.username).then((user: any) => {
					group.removeMembers(user, function(err: Error) {
						if (err) {
							return res.status(500).send("ERROR: Group update failed");
						} else {
							return res.status(204).send();
						}
					});
				})
				.catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
			})
			.catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		private getProduct = (productId: Number) => {
			return new Promise((resolve, reject) => {
				this.productModel.one({id: productId}, function(err: Error, product: any) {
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

		private getGroup = (groupId: Number) => {
			return new Promise((resolve, reject) => {
				this.participantGroupModel.one({id: groupId}, function(err: Error, group: any) {
					if (err) {
						let errorMsg = ErrorHandler.getErrorMsg("Group data", ErrorType.DATABASE_READ);
						reject(new DatabaseError(500, errorMsg));
					} else if (!group) {
						let errorMsg = ErrorHandler.getErrorMsg("Group", ErrorType.NOT_FOUND);
						reject(new DatabaseError(400, errorMsg));
					} else {
						return resolve(group);
					}
				});
			});
		}
	}
}

export = Route;