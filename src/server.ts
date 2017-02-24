"use strict";

import * as express from "express";

import * as testRoute from "./routes/testRoute";
import Promise from "ts-promise";
//import database  from "./models/index";
import { DatabaseHandler } from "./models/databasehandler";

class Server {
	public app: express.Application;
	private handler: any;
	constructor() {
		this.handler = new DatabaseHandler();
		this.app = express();
		let connection = this.handler.syncDbModels();
		connection.then((res: any) => {
			this.setRoutes();
		});
		connection.catch((err: any) => {
			console.log (err);
		});
	}

	public static init(): Server {
    	return new Server();
  	}

	private setRoutes() {
		let router: express.Router;
	    router = express.Router();

	    // Define routes here
	    var test: testRoute.TestRoute = new testRoute.TestRoute(this.handler);
	    console.log("Setting testroute");
	    router.get("/", test.test);

	    this.app.use(router);
	}
}

var server = Server.init();
export = server;