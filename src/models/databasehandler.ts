"use strict";
var orm = require("orm");
var fs = require("fs");
var path = require("path");
import Promise from "ts-promise";
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
		return new Promise((resolve: any, reject: any) => {
			console.log("Connecting to database");
			let files = [];
			this.connectToDb().then((db: any) => {
				var modelsFolder = path.join(__dirname, "/../models");
				fs
					.readdirSync(modelsFolder)
					.filter(function (file: any) {
						return file !== path.basename(module.filename);
					})
					.forEach(function (file: any) {
						db.load(path.join(modelsFolder, file), function (err: String) {
							if (err) {
								console.error(err);
								throw err;
							}
						});

						console.log("Synced " + file + " with the database");
					});

				this.updateModelReferences(db);

				// Generate the tables, does not drop the old ones
				db.sync(function (err: string) {
					if (err) {
						throw err;
					}
				});

				this.dbConnection = db;
				this.models = db.models;
				console.log("Models synced with database");

				return db;
			}).then((db: any) => {
				resolve(db);
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
		db.models.Discount.hasOne("product", db.models.Product, {}, { reverse: "discounts" });

		db.models.Event.hasMany("products", db.models.Product, {}, { reverse: "events" });
		db.models.Event.hasMany("organizers", db.models.User);

		db.models.ParticipantGroup.hasMany("members", db.models.User, {}, { reverse: "memberships" });
		//db.models.ParticipantGroup.hasMany("moderator", db.models.User, {}, { reverse: "moderatedGroups" });

		db.models.Payment.hasOne("event", db.models.Event, {}, { reverse: "products" });
		db.models.Payment.hasOne("payee", db.models.User, {}, { reverse: "payments" });

		db.models.Product.hasMany("discounts", db.models.Discount, {}, { reverse: "product" });

		db.models.User.hasMany("products", db.models.Product);
		db.models.User.hasMany("moderatedGroups", db.models.ParticipantGroup, {}, { reverse: "moderator" });
		db.models.User.hasMany("payments", db.models.Payment, {}, { reverse: "payee" });

		db.models.User.extendsTo("admin", {});

		console.log("References updated");
	}
}