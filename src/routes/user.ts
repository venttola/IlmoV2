"use strict";

import * as express from "express";
import { DatabaseHandler } from "../models/databasehandler";

/*
	GET /api/user/:username 
	PATCH /api/user/:username/credentials 
	PATCH /api/user/:username/detail
	GET /api/user/:username/products
	POST /api/user/:username/product
	DELETE /api/user/:username/product
	POST /api/user/:username/group
	DELETE /api/user/:username/group
*/
module Route {
	export class UserRoutes {
		constructor(private handler: DatabaseHandler) {

		}

		public setUserCredentials = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public getUserInfo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			console.log("Username: " + req.params.username);
			return res.status(204).send();
		}

		public setUserInfo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public getProducts = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public addProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public removeProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public addGroup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}

		public removeGroup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
			return res.status(204).send();
		}
	}
}

export = Route;