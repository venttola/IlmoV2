"use strict";

import * as express from "express";
import { DatabaseHandler } from "../models/databasehandler";

module Route {
  export class TestRoute {
  	constructor(private handler: DatabaseHandler) {
  	}
    public test = (req: express.Request, res: express.Response, next: express.NextFunction) => {
		this.handler.getModels().User.create({
			email: "test",
			password: "test",
			firstname: "test",
			lastname: "test",
			dob: new Date(),
			allergies: "test"
		}, function(err: any) {
			if (err) {
				throw err;
			}

			return res.send("Test");
		});
    }
  }
}

export = Route;