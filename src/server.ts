"use strict";

import * as express from "express";
//import Promise from "ts-promise";
import * as bodyparser from "body-parser";
import * as jwt from "express-jwt";
import * as cors from "cors";

import { DatabaseHandler } from "./databasehandler";
import { PriviledgeChecker } from "./middleware/priviledgechecker";
import { UserService } from "./services/userservice";
import { OrganizationService } from "./services/organizationservice";
import { EventService } from "./services/eventservice";
import { AuthService } from "./services/authservice";
import { GroupService } from "./services/groupservice";
import { AdminService } from "./services/adminservice";
import { MailerService } from "./services/mailerservice";
import * as authRoutes from "./routes/auth";
import * as userRoutes from "./routes/user";
import * as eventRoutes from "./routes/event";
import * as groupRoutes from "./routes/group";
import * as organizationRoutes from "./routes/organization";
import * as adminRoutes from "./routes/admin";
import * as config from "config";

class Server {
	public app: express.Application;

	private readonly API_PREFIX: string;
	private readonly SALT_ROUNDS: number;
	private readonly SECRET: string;

	private handler: DatabaseHandler;
	private priviledgeChecker: PriviledgeChecker;
	private userService: UserService;
	private eventService: EventService;
	private organizationService: OrganizationService;
	private authService: AuthService;
	private groupService: GroupService;
	private adminService: AdminService;
	private mailerService: MailerService;

	constructor() {
		const corsOptions: any = {
			origin: config.get("corsOrigin")
		};
		this.API_PREFIX = <string>config.get("api_prefix");
		this.SALT_ROUNDS = <number>config.get("salt_rounds");
		this.SECRET = <string>config.get("secret");

		this.handler = new DatabaseHandler();
		let connection = this.handler.syncDbModels();

		connection.then((conn: any) => {
			let models = this.handler.getModels();
			this.userService = new UserService(models.User,
				models.UserPayment,
				models.ProductSelection,
				models.Product);
			this.eventService = new EventService(models.Event);
			this.organizationService = new OrganizationService(models.Organization);
			this.authService = new AuthService(this.userService);
			this.groupService = new GroupService(models.ParticipantGroup,
				this.userService,
				models.Product,
				models.Discount,
				models.Participant,
				models.PlatoonModel,
				this.eventService,
				);
			this.adminService = new AdminService(models.User,
												 models.GroupPayment);
			this.mailerService = new MailerService(this.userService);
			this.setRoutes();
			this.priviledgeChecker = new PriviledgeChecker();
		}).catch((err: Error) => {
			console.log(err);
		});
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

		this.setEventRoutes(router);

		this.setUserRoutes(router);
		this.setGroupRoutes(router);
		this.setOrganizationRoutes(router);
		this.setAdminRoutes(router);

		this.app.use(bodyparser.json());
		this.app.use(router);
	}

	private setAuthRoutes(router: express.Router) {
		let models = this.handler.getModels();
		let authRoute: authRoutes.AuthRoutes = new authRoutes.AuthRoutes(this.SECRET,
																		 this.SALT_ROUNDS,
																		 models.User,
																		 this.authService,
																		 this.mailerService);
		router.post(this.API_PREFIX + "/signup", authRoute.signup);
		router.post(this.API_PREFIX + "/login", authRoute.login);
		router.post(this.API_PREFIX + "/forgotpassword", authRoute.requestPasswordReset);
		router.post(this.API_PREFIX + "/resetpassword", authRoute.resetPassword);
	}

	private setUserRoutes(router: express.Router) {
		console.log("Setting user routes");

		let models = this.handler.getModels();

		let userRoute: userRoutes.UserRoutes =
			new userRoutes.UserRoutes(
				this.userService,
				this.eventService,
				this.groupService,
				models.Product,
				models.Discount,
				models.ParticipantGroup,
				models.UserPayment,
				models.ProductSelection,
				models.GroupPayment,
				this.SALT_ROUNDS
			);

		const userApiPrefix = this.API_PREFIX + "/user/:username";
		const newUserApiPrefix = this.API_PREFIX + "/user/:id";

		router.get(userApiPrefix + "/", userRoute.getUserInfo);
		router.patch(userApiPrefix + "/credentials", userRoute.setUserCredentials);
		router.patch(userApiPrefix + "/detail", userRoute.setUserInfo);
		router.get(userApiPrefix + "/products", userRoute.getProducts);
		router.post(userApiPrefix + "/event/signup", userRoute.signup);
		router.delete(userApiPrefix + "/event/group/:groupId", userRoute.cancelSignup);
		router.post(userApiPrefix + "/event/data", userRoute.getEventSignUpData);
		router.get(userApiPrefix + "/event/signup", userRoute.getSignUps);
		router.delete(userApiPrefix + "/product", userRoute.removeProduct);
		router.post(userApiPrefix + "/group", userRoute.addGroup);
		router.delete(userApiPrefix + "/group", userRoute.removeGroup);

		router.get(newUserApiPrefix + "/organizations", userRoute.getOrganizations);
		console.log("User routes set");
	}

	private setEventRoutes(router: express.Router) {
		console.log("Setting event routes");
		let models = this.handler.getModels();

		let eventRoute: eventRoutes.EventRoutes =
			new eventRoutes.EventRoutes(
				models.Event,
				models.Product,
				models.Discount,
				models.Platoon,
				models.ParticipantGroup,
				models.GroupPayment,
				this.userService,
				this.organizationService
			);

		router.get(this.API_PREFIX + "/events", eventRoute.getEvents);
		router.use(this.checkAuth());
		router.post(this.API_PREFIX + "/events", /*this.priviledgeChecker.checkAdmin,*/ eventRoute.addEvent);
		router.get(this.API_PREFIX + "/events/:event/product", eventRoute.getEventProducts);
		router.post(this.API_PREFIX + "/events/:event/product", eventRoute.addProduct);
		router.patch(this.API_PREFIX + "/events/:event/product", eventRoute.updateProduct);
		router.post(this.API_PREFIX + "/events/:event/organization", eventRoute.setOrganization);
		router.delete(this.API_PREFIX + "/events/:event", eventRoute.deleteEvent);
		router.post(this.API_PREFIX + "/events/:event/group", eventRoute.addParticipantGroup);
		router.post(this.API_PREFIX + "/events/:event/platoons", eventRoute.addPlatoons);
		router.patch(this.API_PREFIX + "/events/:event/platoon", eventRoute.updatePlatoon);
		router.get(this.API_PREFIX + "/events/:event", eventRoute.getEventDetails);
		router.post(this.API_PREFIX + "/events/:event/opensignup", eventRoute.openRegisteration);
		router.post(this.API_PREFIX + "/events/:event/closesignup", eventRoute.closeRegisteration);
		console.log("Event routes set");
	}

	private setGroupRoutes(router: express.Router) {
		let models = this.handler.getModels();

		let groupRoute: groupRoutes.GroupRoutes =
			new groupRoutes.GroupRoutes(
				models.ParticipantGroup,
				models.Product,
				models.Discount,
				models.Participant,
				models.ParticipantPayment,
				models.ProductSelection,
				models.GroupPayment,
				this.userService,
				this.groupService
			);

		//router.post(this.API_PREFIX + "/group", groupRoute.addGroup);
		router.get(this.API_PREFIX + "/group/:group", groupRoute.getParticipantGroup);
		//router.get(this.API_PREFIX + "/group/:group/:username/products", groupRoute.getMemberProducts);
		router.get(this.API_PREFIX + "/group/:username/moderation", groupRoute.getModeratedGroups);

		// Moderator routes
		router.use(this.API_PREFIX + "/group/:group/moderator/*", groupRoute.checkModerator);
		router.get(this.API_PREFIX + "/group/:group/moderator/members", groupRoute.getGroupMembers);
		router.get(this.API_PREFIX + "/group/:group/moderator/userpayment/:member", groupRoute.getMemberPayments);
		router.delete(this.API_PREFIX + "/group/:group/moderator/:member", groupRoute.removeMember);
		router.post(this.API_PREFIX + "/group/:group/moderator/userpayment", groupRoute.receiptPayment);
		router.patch(this.API_PREFIX + "/group/:group/moderator", groupRoute.addModerator);
		router.delete(this.API_PREFIX + "/group/:group/moderator/:member/moderator", groupRoute.removeModerator);
		router.get(this.API_PREFIX + "/group/:group/event", groupRoute.getGroupEvent);
		//Participant
		router.post(this.API_PREFIX + "/group/:group/moderator/participants", groupRoute.addParticipant);
		router.delete(this.API_PREFIX + "/group/:group/moderator/participants/:participant", groupRoute.removeParticipant);
		router.get(this.API_PREFIX + "/group/:group/moderator/participants", groupRoute.getParticipants);
		router.get(this.API_PREFIX + "/group/:group/moderator/participantpayment/:participant", groupRoute.getParticipantPayments);
		router.post(this.API_PREFIX + "/group/:group/moderator/participantpayment", groupRoute.receiptParticipantPayment);

		router.get(this.API_PREFIX + "/group/:group/moderator/products", groupRoute.getAvailableProducts);
		router.get(this.API_PREFIX + "/group/:group/checkout", groupRoute.getGroupCheckout);
		router.get(this.API_PREFIX + "/group/:group/receipt", groupRoute.receiptGroupPayment);


		console.log("Group routes set");
	}

	private setOrganizationRoutes(router: express.Router) {
		let models = this.handler.getModels();

		let organizationRoute: organizationRoutes.OrganizationRoutes =
			new organizationRoutes.OrganizationRoutes(
				this.userService,
				this.organizationService,
				models.Organization
			);
		router.get(this.API_PREFIX + "/organizations", organizationRoute.getOrganizations);
		//needs to be chanegd to organization
		router.post(this.API_PREFIX + "/organizations", organizationRoute.addOrganization);
		router.post(this.API_PREFIX + "/organizations/:id/members", organizationRoute.addOrganizationMembers);
	}
	private setAdminRoutes(router: express.Router) {
		let adminRoute: adminRoutes.AdminRoutes =
			new adminRoutes.AdminRoutes(
				this.userService,
				this.eventService,
				this.groupService,
				this.adminService,
				this.SALT_ROUNDS);
		router.get(this.API_PREFIX + "/admin/users", adminRoute.getAllUsers);
		router.patch(this.API_PREFIX + "/admin/users/resetpassword/:username", adminRoute.resetUserPassword);
	}
	private checkAuth() {
		return jwt({
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
		});
	}
}

var server = Server.init();
export = server;