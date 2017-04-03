"use strict";

import * as express from "express";
import Promise from "ts-promise";
import * as bodyparser from "body-parser";
import * as jwt from "express-jwt";
import * as cors from "cors";

import { DatabaseHandler } from "./models/databasehandler";
import { PriviledgeChecker } from "./middleware/priviledgechecker";
import { UserService } from "./services/userservice";

import * as testRoute from "./routes/testRoute";
import * as authRoutes from "./routes/auth";
import * as userRoutes from "./routes/user";
import * as eventRoutes from "./routes/event";
import * as groupRoutes from "./routes/group";

class Server {
	public app: express.Application;

	private readonly API_PREFIX: String;
	private readonly SALT_ROUNDS: number;
	private readonly SECRET: string;

	private handler: DatabaseHandler;
	private priviledgeChecker: PriviledgeChecker;
	private userService: UserService;

	constructor() {
		let config = require("./config.json");
		let corsOptions: any = {
			origin: "http://localhost:4200"
		};
		this.API_PREFIX = config.API_PREFIX;
		this.SALT_ROUNDS = config.SALT_ROUNDS;
		this.SECRET = config.SECRET;

		this.handler = new DatabaseHandler();
		let connection = this.handler.syncDbModels();

		connection.then((conn: any) => {
			let models = this.handler.getModels();
			this.userService = new UserService(models.User);
			this.setRoutes();
		}).catch((err: Error) => {
			console.log(err);
		});

		this.priviledgeChecker = new PriviledgeChecker();

		this.app = express();
		this.app.use(cors(corsOptions));
	}

	public static init(): Server {
		return new Server();
	}

	private setRoutes() {
		let router: express.Router;
		router = express.Router();

		// Login and signup routes do not need authentication,
		// Define them before setting router to use jwt
		this.setAuthRoutes(router);

		router.use(jwt({
			secret: this.SECRET,
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
		this.setGroupRoutes(router);

		this.app.use(bodyparser.json());
		this.app.use(router);
	}

	private setAuthRoutes(router: express.Router) {
		let authRoute: authRoutes.AuthRoutes = new authRoutes.AuthRoutes(this.handler, this.SECRET, this.SALT_ROUNDS);
		router.post(this.API_PREFIX + "/signup", authRoute.signup);
		router.post(this.API_PREFIX + "/login", authRoute.login);
	}

	private setUserRoutes(router: express.Router) {
		console.log("Setting user routes");

		let models = this.handler.getModels();

		let userRoute: userRoutes.UserRoutes =
			new userRoutes.UserRoutes(
				this.userService,
				models.Product,
				models.ParticipantGroup,
				this.SALT_ROUNDS
			);

		const userApiPrefix = this.API_PREFIX + "/user/:username";

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
				this.userService
			);

		router.get(this.API_PREFIX + "/events", eventRoute.getEvents);
		router.post(this.API_PREFIX + "/events", /*this.priviledgeChecker.checkAdmin,*/ eventRoute.addEvent);
		router.get(this.API_PREFIX + "/events/:event/product", eventRoute.getEventProducts);
		router.post(this.API_PREFIX + "/events/:event/product", eventRoute.addProduct);
		router.post(this.API_PREFIX + "/events/:event/organizer", eventRoute.addOrganizer);
		router.delete(this.API_PREFIX + "/events/:event", eventRoute.deleteEvent);
	}

	private setGroupRoutes(router: express.Router) {
		let models = this.handler.getModels();

		let groupRoute: groupRoutes.GroupRoutes =
			new groupRoutes.GroupRoutes(
				models.ParticipantGroup,
				this.userService
			);

		router.post(this.API_PREFIX + "/group", groupRoute.addGroup);
		router.delete(this.API_PREFIX + "/group/:group/:username", groupRoute.removeMember);
		router.patch(this.API_PREFIX + "/group/:group/moderator", groupRoute.addModerator);
		router.delete(this.API_PREFIX + "/group/:group/:username/moderator", groupRoute.removeModerator);
		router.get(this.API_PREFIX + "/group/:group/:username/products", groupRoute.getMemberProducts);
	}
}

var server = Server.init();
export = server;