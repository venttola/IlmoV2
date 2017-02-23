"use strict";

import * as express from "express";

import * as testRoute from "./routes/testRoute";
import Promise from "ts-promise";
import * as DbHandler from "./models";

class Server {
	public app: express.Application;
	constructor() {
		this.app = express();
		DbHandler.default.syncDbModels().then(response  => {
			this.setRoutes();
		}, reject => {
			console.error(reject);
		});
	}

	public static init(): Server {
    	return new Server();
  	}

	private setRoutes() {
		let router: express.Router;
	    router = express.Router();

	    // Define routes here
	    var test: testRoute.TestRoute = new testRoute.TestRoute();
	    console.log("Setting testroute");
	    router.get("/", test.test);

	    this.app.use(router);
	}
}

var server = Server.init();
export = server;