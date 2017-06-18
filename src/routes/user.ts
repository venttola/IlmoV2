"use strict";

import * as express from "express";
//import Promise from "ts-promise";
import * as bcrypt from "bcrypt";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { EventService } from "../services/eventservice";
import { GroupService } from "../services/groupservice";

import { uniq, flatten, contains } from "underscore";

module Route {
	class SignUpData {
		signedUp: boolean;
		group: any;
		eventProducts: any;
		isRegistrationOpen: boolean;
	}

	export class UserRoutes {
		constructor(
			private userService: UserService,
			private eventService: EventService,
			private groupService: GroupService,
			private productModel: any,
			private discountModel: any,
			private participantGroupModel: any,
			private userPayment: any,
			private productSelectionModel: any,
			private groupPaymentModel: any,
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
										return res.status(500).send("Error: Credential update failed");
									}
								});
							} else {
								console.log("Hash calculation failed", err);
								return res.status(500).send("Error: Credential update failed");
							}
						});
					} else {
						console.log("Credential update failed", err);
						return res.status(403).send("Error: Invalid password");
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
			}).catch((err: APIError) => {
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
						return res.status(403).send("User details update failed");
					}
				}).catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
			}).catch((err: APIError) => {
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
			}).catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		// TODO: Apidocs
		public getEventSignUpData = (req: express.Request, res: express.Response) => {
			console.log("Getting signup data");
			let groupId = req.body.groupId;
			let eventId = req.body.eventId;
			let username = req.params.username;

			let signUpData: SignUpData = new SignUpData();

			let self = this;

			// TODO: Use groupService.getGroupPayment instead of fetching group first and then grouppayment through it
			Promise.all([
				this.userService.getUser(username),
				this.groupService.getGroup(groupId),
				this.eventService.isEventRegistrationOpen(eventId)]).then((results: any) => {
					let user = results[0];
					let group = results[1];
					let isRegistrationOpen = results[2];

					signUpData.group = group;
					signUpData.isRegistrationOpen = isRegistrationOpen;

					// Get group payment - there should be only one
					group.getGroupPayment(function (err: Error, groupPayment: any) {
						// Get all user payments
						user.getUserPayments(function (err: Error, userPayments: any) {
							if (err) {
								let errorMsg = ErrorHandler.getErrorMsg("Payment data", ErrorType.DATABASE_READ);
								return res.status(500).send(errorMsg);
							}

							// Get user payments related to this group payment
							let userPaymentsInGroup = userPayments.filter((p: any) => groupPayment[0].userPayments.some((x: any) => p.id === x.id));

							userPaymentsInGroup.length > 0 ? signUpData.signedUp = true : signUpData.signedUp = false;

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
												// TODO: Mark paid status and disable checkbox in UI if already paid
												e.selected = true;
												// Mark discount as selected
												if (prod.discount_id && prod.discount_id != null) {
													e.discounts.find((d: any) => d.id === prod.discount_id).selected = true;
												}
											}
										});
									}
								}

								signUpData.eventProducts = eventProducts;
								signUpData.group.groupPayment = undefined;
								return res.status(200).json(signUpData);
							}).catch((err: APIError) => {
								return res.status(err.statusCode).send(err.message);
							});
						});
					});
				}).catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
		}

		// TODO: apiDocs
		public signup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let groupId = +req.body.groupId;
			let selectedProducts = req.body.products;
			let selectionIDs = selectedProducts.map((p: any) => [p[0], p[1]]);
			let discountIds: Array<number> = selectionIDs.map((p: any) => p[1]);

			this.groupService.getEventStatusByParticipantgroup(groupId)
				.then((isOpen: boolean) => {
					if (isOpen) {
						return this.userService.getUserPayments(req.params.username);
					} else {
						throw new APIError(403, "ERROR: Registration is closed");
					}
				}).then((userPayments: any) => {
					let paymentsInGroup = userPayments
						.filter((p: any) => p.payment[0].payee_id === groupId);
					let openPayment = paymentsInGroup
						.find((p: any) => p.isPaid === false);

					// Update the open payment with the new product selections
					if (openPayment) {
						console.log("Updating old payment");
						this.removeOldProducts(openPayment)
							.then((result: any) => {
								let prodIds = selectionIDs.map((s: any) => s[0]);
								return this.userService.getProductsFromDb(prodIds);
							}).then((products: any) => {
								console.log("Products: " + JSON.stringify(products));
								// Add new product selections
								this.userService.addPaymentProducts(openPayment, products, discountIds).then((empty: any) => {
									return res.status(204).send();
								}).catch((err: APIError) => {
									return res.status(err.statusCode).send(err.message);
								});
							});
					} else {
						console.log("Creating new payment");
						let oldProductIds = flatten(paymentsInGroup.map((p: any) =>
							p.productSelections.map((ps: any) => ps.product_id)));

						let newProds = selectionIDs.filter((s: any) => !contains(oldProductIds, s[0]));

						this.groupService.getParticipantGroupPayment(groupId)
							.then((groupPayment: any) => {
								return this.userService.createUserPaymentWithSelections(req.params.username, newProds, groupPayment);
							}).then((result: any) => {
								return res.status(204).send();
							});
					}
				}).catch((err: APIError) => {
					return res.status(err.statusCode).send(err.message);
				});
		}

		public getSignUps = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let username = req.params.username;

			this.userService.getUser(username).then((user: any) => {
				user.getUserPayments((err: Error, userPayments: any) => {
					if (err) {
						let errorMsg = ErrorHandler.getErrorMsg("User Payment data", ErrorType.DATABASE_READ);
						return res.status(500).send(errorMsg);
					}

					this.fetchSignUpDetails(userPayments).then((details: any) => {
						return res.status(200).json(uniq(uniq(details, false, (d: any) => d.eventId)));
					});
				});
			});
		}

		public cancelSignup = (req: express.Request, res: express.Response) => {
			console.log("Canceling signup");

			let username = req.params.username;
			let groupId = req.params.groupId;

			Promise.all([this.userService.getUser(username), this.groupService.getGroup(groupId)]).then((result: any) => {
				let user = result[0];
				let group = result[1];

				group.getGroupPayment((err: Error, groupPayment: any) => {
					groupPayment[0].getUserPayments((err: Error, userPayments: any) => {
						if (err) {
							return res.status(500).send(err.message);
						}

						let promises: any[] = [];

						userPayments.forEach((up: any) => promises.push(new Promise((resolve, reject) => {
							up.getPayee((err: Error, payeeUser: any) => {
								if (err) {
									reject(err);
								}

								if (payeeUser[0].id === user.id) {
									groupPayment[0].removeUserPayments(up, (err: Error) => {
										if (err) {
											reject(err);
										}

										up.remove((err: Error) => err ? reject(err) : resolve(true));
									});
								}

								resolve(true);
							});
						})));

						Promise.all(promises).then((result: any) => res.status(204).send())
							.catch((err: APIError) => {
								return res.status(err.statusCode).send(err.message);
							});
					});
				});
			}).catch((err: APIError) => {
				return res.status(err.statusCode).send(err.message);
			});
		}

		// TODO: Refactor this
		private fetchSignUpDetails = (userPayments: any) => {
			let promises: any[] = [];

			userPayments.forEach((up: any) => {
				promises.push(new Promise((resolve, reject) => {
					up.getPayment((err: Error, groupPayment: any) => {
						if (err) {
							reject(err);
						}

						groupPayment[0].getPayee((err: Error, group: any) => {
							if (err) {
								reject(err);
							}

							group.getPlatoon((err: Error, platoon: any) => {
								if (err) {
									reject(err);
								}

								platoon[0].getEvent((err: Error, event: any) => {
									if (err) {
										reject(err);
									}

									resolve({
										eventId: event[0].id,
										eventName: event[0].name,
										groupId: group.id,
										groupName: group.name
									});
								});
							});
						});
					});
				}));
			});

			return Promise.all(promises);
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

			this.groupService.getGroup(groupId).then((group: any) => {
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

			this.groupService.getGroup(groupId).then((group: any) => {
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
	}
}

export = Route;