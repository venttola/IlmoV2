"use strict";

import * as express from "express";
import Promise from "ts-promise";
import * as bodyparser from "body-parser";
import * as jwt from "express-jwt";
import * as cors from "cors";

import { DatabaseHandler } from "./models/databasehandler";
import { PriviledgeChecker } from "./middleware/priviledgechecker";
import { UserService } from "./services/userservice";
import { OrganizationService } from "./services/organizationservice";
import { EventService } from "./services/eventservice";

import * as authRoutes from "./routes/auth";
import * as userRoutes from "./routes/user";
import * as eventRoutes from "./routes/event";
import * as groupRoutes from "./routes/group";
import * as organizationRoutes from "./routes/organization";

class Server {
	public app: express.Application;

	private readonly API_PREFIX: String;
	private readonly SALT_ROUNDS: number;
	private readonly SECRET: string;

	private handler: DatabaseHandler;
	private priviledgeChecker: PriviledgeChecker;
	private userService: UserService;
	private eventService: EventService;
	private organizationService: OrganizationService;

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
			this.eventService = new EventService(models.Event);
			this.organizationService = new OrganizationService(models.Organization);
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
		this.setOrganizationRoutes(router);
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
				this.eventService,
				models.Product,
				models.Discount,
				models.ParticipantGroup,
				models.UserPayment,
				models.ProductSelection,
				models.GroupPayment,
				this.SALT_ROUNDS
			);

		const userApiPrefix = this.API_PREFIX + "/user/:username";

		router.get(userApiPrefix + "/", userRoute.getUserInfo);
		router.patch(userApiPrefix + "/credentials", userRoute.setUserCredentials);
		router.patch(userApiPrefix + "/detail", userRoute.setUserInfo);
		router.get(userApiPrefix + "/products", userRoute.getProducts);
		router.post(userApiPrefix + "/event/products", userRoute.getEventProducts);
		router.post(userApiPrefix + "/event/signup", userRoute.signup);
		router.get(userApiPrefix + "/event/signup", userRoute.getSignUps);
		router.delete(userApiPrefix + "/product", userRoute.removeProduct);
		router.post(userApiPrefix + "/group", userRoute.addGroup);
		router.delete(userApiPrefix + "/group", userRoute.removeGroup);
		console.log("User routes set");
	}

	private setEventRoutes(router: express.Router) {
		console.log("Setting event routes");
		let models = this.handler.getModels();

		let eventRoute: eventRoutes.EventRoutes =
			new eventRoutes.EventRoutes(
				models.Event,
				models.Product,
				models.Platoon,
				models.ParticipantGroup,
				models.GroupPayment,
				this.userService,
				this.organizationService
			);

		router.get(this.API_PREFIX + "/events", eventRoute.getEvents);
		router.post(this.API_PREFIX + "/events", /*this.priviledgeChecker.checkAdmin,*/ eventRoute.addEvent);
		router.get(this.API_PREFIX + "/events/:event/product", eventRoute.getEventProducts);
		router.post(this.API_PREFIX + "/events/:event/product", eventRoute.addProduct);
		router.post(this.API_PREFIX + "/events/:event/organization", eventRoute.setOrganization);
		router.delete(this.API_PREFIX + "/events/:event", eventRoute.deleteEvent);
		router.post(this.API_PREFIX + "/events/:event/group", eventRoute.addParticipantGroup);
		router.post(this.API_PREFIX + "/events/:event/platoons", eventRoute.addPlatoons);
		router.get(this.API_PREFIX + "/events/:event", eventRoute.getEventDetails);
		console.log("Event routes set");
	}

	private setGroupRoutes(router: express.Router) {
		let models = this.handler.getModels();

		let groupRoute: groupRoutes.GroupRoutes =
			new groupRoutes.GroupRoutes(
				models.ParticipantGroup,
				this.userService
			);

		//router.post(this.API_PREFIX + "/group", groupRoute.addGroup);
		router.get(this.API_PREFIX + "/group/:group", groupRoute.getParticipantGroup);
		router.delete(this.API_PREFIX + "/group/:group/:username", groupRoute.removeMember);
		router.patch(this.API_PREFIX + "/group/:group/moderator", groupRoute.addModerator);
		router.delete(this.API_PREFIX + "/group/:group/:username/moderator", groupRoute.removeModerator);
		router.get(this.API_PREFIX + "/group/:group/:username/products", groupRoute.getMemberProducts);
	}
	private setOrganizationRoutes(router: express.Router) {
		let models = this.handler.getModels();

		let organizationRoute: organizationRoutes.OrganizationRoutes =
			new organizationRoutes.OrganizationRoutes(
					this.userService,
					models.Organization
				);
		router.get(this.API_PREFIX + "/organizations", organizationRoute.getOrganizations);
		router.post(this.API_PREFIX + "/organizations", organizationRoute.addOrganization);
		router.post(this.API_PREFIX + "/organizations", organizationRoute.addOrganizationMembers);
	}
}

var server = Server.init();
export = server;