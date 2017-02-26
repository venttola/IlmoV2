"use strict";

import * as express from "express";
import Promise from "ts-promise";
import * as jwt from "jsonwebtoken";
import { DatabaseHandler } from "./models/databasehandler";
import * as bodyparser from "body-parser";

import * as testRoute from "./routes/testRoute";
import * as authRoutes from "./routes/auth";
import * as userRoutes from "./routes/user";


const API_PREFIX: string = "/api";
const SALT_ROUNDS: number = 10;
class Server {
	public app: express.Application;
	private handler: any;
	constructor() {
		this.handler = new DatabaseHandler();
		this.app = express();
		this.app.set("superSecret", "testisalaisuus");
		this.app.set("saltRounds", 10);
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

	    this.setAuthRoutes(router);
	    this.setUserRoutes(router);

	    this.app.use(bodyparser.json());
	    this.app.use(router);
	}

	private setAuthRoutes(router: express.Router) {
		let authRoute: authRoutes.AuthRoutes = new authRoutes.AuthRoutes( this.handler, this.app.get("superSecret"), SALT_ROUNDS);
		router.post(API_PREFIX + "/signup", authRoute.signup);
		router.post(API_PREFIX + "/login", authRoute.login);
	}

	private setUserRoutes(router: express.Router) {
		console.log("Setting user routes");

		let userRoute: userRoutes.UserRoutes = new userRoutes.UserRoutes(this.handler);

		const userApiPrefix = API_PREFIX + "/user/:username";

		router.get(userApiPrefix + 		"/", userRoute.getUserInfo);
		router.patch(userApiPrefix + 	"/credentials");
		router.patch(userApiPrefix + 	"/detail");
		router.get(userApiPrefix + 		"/products");
		router.post(userApiPrefix + 	"/product");
		router.delete(userApiPrefix + 	"/product");
		router.post(userApiPrefix + 	"/group");
		router.delete(userApiPrefix + 	"/group");
	}

	private checkAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
		let self = this;
		// check header or url parameters or post parameters for token
		let token: string = req.body.token || req.query.token || req.get("x-access-token");
		console.log(req.get("x-access-token"));
		console.log(token);
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, self.app.get("superSecret"), function (err: any, decoded: any) {
				if (err) {
					return res.json({ success: false, message: "Failed to authenticate token." });
				} else {
					// if everything is good, save to request for use in other routes
					// req.decoded = decoded;
					next();
				}
			});
		} else {
			// if there is no token
			// return an error
			return res.status(403).send({
				success: false,
				message: "No token provided."
			});
		}
	}
}

var server = Server.init();
export = server;