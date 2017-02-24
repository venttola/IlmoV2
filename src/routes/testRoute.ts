"use strict";

import * as express from "express";
import { DatabaseHandler } from "../models/databasehandler";

module Route {
  export class TestRoute {
  	constructor(private handler: DatabaseHandler) {
  	}
    public test = (req: express.Request, res: express.Response, next: express.NextFunction) => {
		let self = this;
		this.handler.getModels().User.create({
			name: "Test12345"
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