"use strict";

import * as express from "express";

module Route {
  export class TestRoute {
    public test(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send("Test");
    }
  }
}

export = Route;