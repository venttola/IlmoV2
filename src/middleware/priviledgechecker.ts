import * as express from "express";

module Middleware {
    export class PriviledgeChecker {
        constructor() {
            console.log("Instantiating priviledge checker");
        }

        public checkAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (req.user.admin) {
                next();
            } else {
                return res.status(403).send({
                    success: false,
                    message: "Administrator priviledges required"
                });
            }
        }

        public checkModerator = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            // TODO: Add list of group ids in req.user object
            // and compare the request.body.groupId here with the list
        }
    }
}

export = Middleware;