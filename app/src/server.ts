"use strict";

import * as express from "express";
import * as testRoute from "./routes/testRoute";

class Server {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.setConfig();
		this.setRoutes();
	}

	public static init(): Server {
    	return new Server();
  	}

	private setConfig() {
		
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

