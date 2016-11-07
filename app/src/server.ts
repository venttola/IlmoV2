"use strict";

import * as express from "express";
import * as testRoute from "./routes/testRoute";
var models = require("./models");

class Server {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.getDbConnection();
		this.setRoutes();
	}

	public static init(): Server {
    	return new Server();
  	}

	private getDbConnection() {
		this.app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
			models.getDbConnection((function(err: any, db: any) {
				if (err) {
					return next(err);
				}

	        	(<any>req).models = db.models;

	        	return next();
			}));
		});
	}

	private setRoutes() {
		let router: express.Router;
	    router = express.Router();

	    // Define routes here
	    var test: testRoute.TestRoute = new testRoute.TestRoute();
	    router.get("/", test.test);

	    this.app.use(router);
	}
}

var server = Server.init();
export = server.app;