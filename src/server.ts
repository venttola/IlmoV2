"use strict";

import * as express from "express";
import Promise from "ts-promise";
import { DatabaseHandler } from "./models/databasehandler";
import * as bodyparser from "body-parser";
import * as jwt from "express-jwt";

import * as testRoute from "./routes/testRoute";
import * as authRoutes from "./routes/auth";
import * as userRoutes from "./routes/user";
import * as eventRoutes from "./routes/event";


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
			console.log(err);
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

		router.use(jwt({
			secret: "testisalaisuus",
			credentialsRequired: true,
			getToken: function fromHeaderOrQuerystring(req: any) {
				if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
					return req.headers.authorization.split(" ")[1];
				} else if (req.query && req.query.token) {
					return req.query.token;
				}
				return null;
			}
		}));

		this.setUserRoutes(router);
		this.setEventRoutes(router);

		this.app.use(bodyparser.json());
		this.app.use(router);
	}

	private setAuthRoutes(router: express.Router) {
		let authRoute: authRoutes.AuthRoutes = new authRoutes.AuthRoutes(this.handler, this.app.get("superSecret"), SALT_ROUNDS);
		router.post(API_PREFIX + "/signup", authRoute.signup);
		router.post(API_PREFIX + "/login", authRoute.login);
	}

	private setUserRoutes(router: express.Router) {
		console.log("Setting user routes");

		let models = this.handler.getModels();

		let userRoute: userRoutes.UserRoutes =
			new userRoutes.UserRoutes(
				models.User,
				models.Product,
				models.ParticipantGroup,
				SALT_ROUNDS
			);

		const userApiPrefix = API_PREFIX + "/user/:username";

		router.get(userApiPrefix + "/", userRoute.getUserInfo);
		router.patch(userApiPrefix + "/credentials", userRoute.setUserCredentials);
		router.patch(userApiPrefix + "/detail", userRoute.setUserInfo);
		router.get(userApiPrefix + "/products", userRoute.getProducts);
		router.post(userApiPrefix + "/product", userRoute.addProduct);
		router.delete(userApiPrefix + "/product", userRoute.removeProduct);
		router.post(userApiPrefix + "/group", userRoute.addGroup);
		router.delete(userApiPrefix + "/group", userRoute.removeGroup);
	}

	private setEventRoutes(router: express.Router) {
		let models = this.handler.getModels();

		let eventRoute: eventRoutes.EventRoutes =
			new eventRoutes.EventRoutes(
				models.Event,
				models.Product,
				models.Admin
			);

		router.get(API_PREFIX + "/events", eventRoute.getEvents);
		router.post(API_PREFIX + "/events", this.checkAdmin, eventRoute.addEvent);
		router.get(API_PREFIX + "/event/:event/product", eventRoute.getEventProducts);
		router.post(API_PREFIX + "/event/:event/product", eventRoute.addProduct);
	}

	// TODO: Move to own middleware class
	private checkAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
		console.log("CHECKING ADMIN: " + req.user.admin);

		if (req.user.admin) {
			next();
		} else {
			return res.status(403).send({
				success: false,
				message: "Administrator priviledges required"
			});
		}
	}

	private checkModerator = (req: express.Request, res: express.Response, next: express.NextFunction) => {
		// TODO: Add list of group ids in req.user object
		// and compare the request.body.groupId here with the list
	}
}

var server = Server.init();
export = server;