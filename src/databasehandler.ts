"use strict";
var orm = require("orm");
var fs = require("fs");
var path = require("path");
//import Promise from "ts-promise";
import * as Models from "./models/models";
export class DatabaseHandler {
	private dbConnection: any;
	private models: any;
	constructor() {
		console.log("Constructing databasehandler");
	}
	public getDbConnection() {
		return new Promise((resolve: any, reject: any) => {
			if (this.dbConnection) {
				console.log("Vanha");
				resolve(this.dbConnection);
			}

			this.connectToDb().then((conn: any) => {
				console.log("Uusi");
				this.dbConnection = conn;
				resolve(this.dbConnection);
			});
		});
	}

	public getModels(): any {
		return this.models;
	}

	public syncDbModels() {
			console.log("Retry with the database");
			return new Promise((resolve: any, reject: any) => {
				this.connectToDb().then((db: any) => {
					console.log("Starting sync");
					Models.defineModels(db);
					this.updateModelReferences(db);
					// Generate the tables, does not drop the old ones
					db.sync(function (err: string) {
						if (err) {
							reject(err);
						}
					});
					this.dbConnection = db;
					this.models = db.models;
					console.log("Models synced with database");
					return resolve(db);
				});
			});
	}

	private connectToDb() {
		return new Promise((resolve: any, reject: any) => {
			orm.connect("mysql://devuser@localhost/ILMOV2", function (err: string, db: any) {
				if (err) {
					console.error(err);
					reject(new Error(err));
				}
				resolve(db);
			});
		});
	}

	private updateModelReferences(db: any) {
		console.log("Updating references");
		db.models.Discount.hasOne("product", db.models.Product, {}, { reverse: "discounts" });

		//db.models.ParticipantGroup.hasMany("members", db.models.User, {}, { reverse: "memberships" });

		db.models.Platoon.hasMany("participantGroups", db.models.ParticipantGroup, {}, { autoFetch: true, reverse: "platoon" });

		db.models.Event.hasMany("products", db.models.Product, {}, { reverse: "events" });
		db.models.Event.hasOne("organization", db.models.Organization);
		db.models.Event.hasMany("platoons", db.models.Platoon, {}, { autoFetch: true, reverse: "event" });

		db.models.GroupPayment.hasOne("payee", db.models.ParticipantGroup, {}, { reverse: "groupPayment" });
		db.models.GroupPayment.hasMany("userPayments", db.models.UserPayment, {}, { reverse: "payment", autoFetch: true });
		db.models.GroupPayment.hasMany("participantPayments", db.models.ParticipantPayment, {},
									   {reverse: "participantPayment", autoFetch: true});
		db.models.Product.hasMany("discounts", db.models.Discount, {}, { reverse: "product", autoFetch: true });
		db.models.UserPayment.hasMany("productSelections", db.models.ProductSelection, {}, { autoFetch: true });

		db.models.ProductSelection.hasOne("discount", db.models.Discount, {}, { autoFetch: true });
		db.models.ProductSelection.hasOne("product", db.models.Product, {}, { autoFetch: true });

		//Refactored to UserPaymets.
		// TODO: update all routes
		//db.models.User.hasMany("products", db.models.Product);
		db.models.User.hasMany("moderatedGroups", db.models.ParticipantGroup, {}, { reverse: "moderator" });
		db.models.User.hasMany("userPayments", db.models.UserPayment, {}, { reverse: "payee" });
		db.models.User.hasMany("organizations", db.models.Organization, {}, { reverse: "member" });

		db.models.User.extendsTo("admin", {});

		db.models.Participant.hasMany("payments", db.models.ParticipantPayment, {}, {reverse: "payee"});
		db.models.ParticipantPayment.hasMany("productSelections", db.models.ProductSelection, {}, { autoFetch: true });
		console.log("References updated");
	}
}