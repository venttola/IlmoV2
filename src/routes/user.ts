"use strict";

import * as express from "express";
//import Promise from "ts-promise";
import * as bcrypt from "bcrypt";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { EventService } from "../services/eventservice";

module Route {
	export class UserRoutes {
		constructor(
			private userService: UserService,
			private eventService: EventService,
			private productModel: any,
			private discountModel: any,
			private participantGroupModel: any,
			private userPayment: any,
			private productSelectionModel: any,
			private saltRounds: number
		) {

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
				bcrypt.compare(oldPassword, user.password, function (err: Error, success: any) {
					if (success) {
						console.log("Passwords match");
						bcrypt.hash(newPassword, saltRounds, function (err: Error, hash: any) {
							if (!err) {
								user.password = hash;
								user.save(function (err: Error) {
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
				bcrypt.compare(password, user.password, function (err: Error, success: any) {
					if (success) {
						user.firstname = req.body.firstname;
						user.lastname = req.body.lastname;
						user.dob = new Date(req.body.dob);
						user.allergies = req.body.allergies;
						user.save(function (err: Error) {
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
				user.getProducts(function (err: Error, prods: any) {
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
        * @api {get} /api/user/:username/products/:eventId Get user products by event
        * @apiName Get user products by event
        * @apiGroup User
        * @apiParam {String} username Username
		* @apiParam {String} eventId Event identifier
        * @apiSuccess {JSON} List of user products
        * @apiError NotFound ERROR: User was not found
		* @apiError NotFound ERROR: User was not found
        * @apiError DatabaseReadError Product data could not be read from the database
        */
		public getEventProducts = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let groupId = req.body.groupId;
			let eventId = req.body.eventId;
			let username = req.params.username;

			let self = this;

			Promise.all([this.userService.getUser(username), this.getGroup(groupId)]).then((results: any) => {
				let user = results[0];
				let group = results[1];

				// Get group payment - there should be only one
				group.getGroupPayment(function (err: Error, groupPayment: any) {

					// Get all user payments
					user.getUserPayments(function (err: Error, userPayments: any) {

						// Get user payments related to this group payment
						let userPaymentsInGroup = userPayments.filter((p: any) => groupPayment[0].userPayments.some((x: any) => p.id === x.id));

						// Get event products
						self.eventService.getEventProducts(eventId).then((eventProducts: any) => {

							if (userPaymentsInGroup.length > 0) {
								let userProdSelections: any = [];
								userPaymentsInGroup.forEach((pm: any) => pm.productSelections.forEach((p: any) => userProdSelections.push(p)));

								// Mark products as selected from event productlist which are selected by the user
								if (userProdSelections.length > 0) {
									eventProducts.map((e: any) => {
										let prod = userProdSelections.find((ups: any) => ups.product_id === e.id);

										if (prod) {
											e.selected = true;
											// Mark discount as selected
											if (prod.discount_id && prod.discount_id != null) {
												e.discounts.find((d: any) => d.id === prod.discount_id).selected = true;
											}
										}
									});
								}
							}

							return res.status(200).json(eventProducts);
						});
					});
				});
			});
		}

		// TODO: apiDocs
		public signup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let groupId = req.body.groupId;
			let products = req.body.products;
			let productIds = products.map((p: any) => p[0]);
			let discountIds = products.map((p: any) => p[1]);

			Promise.all([
				this.getProductsFromDb(productIds),
				this.userService.getUser(req.params.username),
				this.getGroup(groupId)
			]).then((results: any) => {
				let products = results[0];
				let user = results[1];
				let group = results[2];
				let paymentModel = this.userPayment;
				let self = this;

				user.getUserPayments(function (err: Error, payments: any) {
					if (err) {
						let errorMsg = ErrorHandler.getErrorMsg("Payment data", ErrorType.DATABASE_READ);
						return res.status(500).send(errorMsg);
					} else {
						let firstOpenPayment = payments.find((p: any) => !p.isPaid);

						// If there's open payments, add products to that one
						if (firstOpenPayment) {

							// Remove old product selections
							self.removeOldProducts(firstOpenPayment).then((result: any) => {

								// Add new product selections
								self.addPaymentProducts(firstOpenPayment, products, discountIds).then((empty: any) => {
									return res.status(204).send();
								}).catch((err: APIError) => {
									return res.status(err.statusCode).send(err.message);
								});
							});
						} else {
							// Create new user payment
							paymentModel.create({
								isPaid: false
							}, function (err: Error, payment: any) {
								if (err) {
									let errorMsg = ErrorHandler.getErrorMsg("User Payment data", ErrorType.DATABASE_INSERTION);
									return res.status(500).send(errorMsg);
								} else {
									// Add products to newly created user payment
									self.addPaymentProducts(payment, products, discountIds).then((result: any) => {
										group.getGroupPayment(function (err: Error, groupPayment: any) {
											if (err) {
												let errorMsg = ErrorHandler.getErrorMsg("Group payment", ErrorType.NOT_FOUND);
												return res.status(404).send();
											}

											// Link user payment to group payment
											groupPayment[0].addUserPayments(payment, function (err: Error) {
												if (err) {
													let errorMsg = ErrorHandler.getErrorMsg("Group Payment data", ErrorType.DATABASE_UPDATE);
													return res.status(500).send(errorMsg);
												} else {
													// Link user payment to user
													user.addUserPayments(payment, function (err: Error) {
														if (err) {
															let errorMsg = ErrorHandler.getErrorMsg("User Payment data", ErrorType.DATABASE_UPDATE);
															return res.status(500).send(errorMsg);
														}

														return res.status(204).send();
													});
												}
											});
										});
									}).catch((err: APIError) => {
										return res.status(err.statusCode).send(err.message);
									});
								}
							});
						}
					}
				});
			});
		}

		private removeOldProducts = (payment: any) => {
			let promises: any = [];

			payment.productSelections.forEach((ps: any) =>
				promises.push(new Promise((resolve, reject) => {

					// Dereference product selections from payment
					payment.removeProductSelections(ps, function (err: Error) {
						// Delete product selections
						ps.remove((err: Error) => err ? reject(err) : resolve(payment));
					});
				})));

			return Promise.all(promises);
		}

		private addPaymentProducts = (payment: any, products: any[], discountIds: number[]) => {
			let selectionPromises: any = [];

			products.forEach((p: any) => {
				selectionPromises.push(new Promise((resolve, reject) => {
					this.productSelectionModel.create({}, function (err: Error, ps: any) {
						ps.setProduct(p, function (err: Error) {
							let disc = p.discounts.find((d: any) => discountIds.some((di: any) => di === d.id));

							if (disc) {
								ps.setDiscount(disc, (err: Error) =>
									err ? reject(err)
										: payment.addProductSelections(ps, (err: Error) =>
											err ? reject(err)
												: resolve(true)));
							} else {
								payment.addProductSelections(ps, (err: Error) => err ? reject(err) : resolve(true));
							}
						});
					});
				}));
			});

			return Promise.all(selectionPromises);
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
					user.removeProducts([product], function (error: Error) {
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
					group.addMembers(user, function (err: Error) {
						if (err) {
							return res.status(500).send("ERROR: Group update failed");
						} else {
							return res.status(204).send();
						}
					});
				}).catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
			}).catch((err: APIError) => {
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
					group.removeMembers(user, function (err: Error) {
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
				this.productModel.one({ id: productId }, function (err: Error, product: any) {
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

		private getProductsFromDb = (products: Number[]) => {
			return new Promise((resolve, reject) => {
				this.productModel.find({ id: products }, function (err: Error, products: any) {
					if (err) {
						let errorMsg = ErrorHandler.getErrorMsg("Product data", ErrorType.DATABASE_READ);
						reject(new DatabaseError(500, errorMsg));
					} else if (!products) {
						let errorMsg = ErrorHandler.getErrorMsg("Product", ErrorType.NOT_FOUND);
						reject(new DatabaseError(400, errorMsg));
					} else {
						return resolve(products);
					}
				});
			});
		}

		private getGroup = (groupId: Number) => {
			return new Promise((resolve, reject) => {
				this.participantGroupModel.one({ id: groupId }, function (err: Error, group: any) {
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