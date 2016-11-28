"use strict";

import * as express from "express";
import * as DbHandler from "../models";

module Route {
  export class TestRoute {
    public test(req: express.Request, res: express.Response, next: express.NextFunction) {
		DbHandler.default.getModels().User.create({
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