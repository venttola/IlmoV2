"use strict";

var orm = require("orm");
var fs = require("fs");
var path = require("path");

import Promise from "ts-promise";

class DatabaseHandler {
	private dbConnection: any;
	private models: any;

	public getDbConnection() {
		return new Promise((resolve, reject) => {
			if (this.dbConnection) {
				console.log("Vanha");
				resolve(this.dbConnection);
			}

			this.connectToDb().then((conn) => {
				console.log("Uusi");
				this.dbConnection = conn;
				resolve(this.dbConnection);
			});
		});
	}

	private connectToDb() {
		return new Promise((res, rej) => {
			orm.connect("mysql://devuser@localhost/ILMOV2", function(err: string, db: any) {
				if (err) {
					console.error(err);
					rej(new Error(err));
				}
				res(db);
			});
		});
	}

	public getModels(): any {
		return this.models;
	}

	public syncDbModels() {
		return new Promise((resolve, reject) => {
			console.log("Connecting to database");
			this.connectToDb().then((db: any) => {
				var modelsFolder = path.join(__dirname, "/../models");
				fs
				.readdirSync(modelsFolder)
				.filter(function(file: any) {
					return file !== path.basename(module.filename);
				})
				.forEach(function(file: any) {
					db.load(path.join(modelsFolder, file), function(err: String) {
						if (err) {
							console.error(err);
							throw err;
						}
					});
					console.log ("Synced " + file + " with the database");
				});

				// Generate the tables, does not drop the old ones
				db.sync(function(err: String) {
		        	if (err) {
		        		throw err;
		        	}
		    	});

				this.dbConnection = db;
				this.models = db.models;
				console.log("Models synced with database");

				return db;
			}).then((db) => {
				resolve(db);
			});
		});
	}
}

export default new DatabaseHandler();