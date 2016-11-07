"use strict";

var orm = require("orm");
var fs = require("fs");
var path = require("path");

var dbConnection: any = null;

export function getDbConnection(cb: any) {
	// Connection exists, return it
	if (dbConnection) {
		return cb(null, dbConnection);
	}

	orm.connect("mysql://devuser@localhost/ilmov2", function(err: String, db: any) {
		if (err) {
			return cb(err);
		}

		var modelsFolder = path.join(__dirname, "/../models");

		fs
		.readdirSync(modelsFolder)
		.filter(function(file: any) {
			return file !== path.basename(module.filename);
		})
		.forEach(function(file: any) {
			db.load(path.join(modelsFolder, file), function(err: String) {
				if (err) {
					throw err;
				}
			});
		});

		// Generate the tables
		db.sync(function(err: String) {
        	if (err) {
        		throw err;
        	}
    	});

    	dbConnection = db;

		console.log("Models synced with database");
		return cb(null, db);
	});
};