import * as express from "express";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { GroupService } from "../services/groupservice";
module Middleware {
  export class PriviledgeChecker {
    constructor(
      private userService: UserService,
      private groupService: GroupService) {
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
      let groupId = req.params.group;
      let username = req.user.email;

      Promise.all([this.userService.getUser(username), this.groupService.getGroup(groupId)]).then((results: any) => {
        let user = results[0];
        let group = results[1];

        group.hasModerator(user, (err: Error, isModerator: boolean) => {
          if (err) {
            let msg = ErrorHandler.getErrorMsg("Moderation status", ErrorType.DATABASE_READ);
            return res.status(500).send(msg);
          } else if (!isModerator) {
            return res.status(403).send("You are not a moderator of this group");
          } else {
            next();
          }
        });
      }).catch((err: APIError) => {
        return res.status(err.statusCode).send(err.message);
      });
    }
  }
}

export = Middleware;