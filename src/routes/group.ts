import * as express from "express";
import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Route {
    export class GroupRoutes {
        constructor(private groupModel: any, private userService: UserService) {

        }

        public addGroup = (req: express.Request, res: express.Response) => {
            console.log(this.groupModel);
            this.groupModel.create({
                name: req.body.name,
                description: req.body.description
            }, function (err: Error, group: any) {
                if (err) {
                    let errorMsg = ErrorHandler.getErrorMsg("Group data", ErrorType.DATABASE_INSERTION);
                    return res.status(500).send(errorMsg);
                } else {
                    return res.status(204).send();
                }
            });
        }

        public removeMember = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group; // Group name or id?
            let username = req.params.username;

            Promise.all([this.getGroup(groupId), this.userService.getUser(username)]).then(values => {
                let group: any = values[0];
                let user: any = values[1];

                group.removeMembers(user, function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Member", ErrorType.DATABASE_DELETE);
                        return res.status(500).send(msg);
                    } else {
                        return res.status(204).send();
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        public addModerator = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;
            let username = req.body.username;

            Promise.all([this.getGroup(groupId), this.userService.getUser(username)]).then(values => {
                let group: any = values[0];
                let user: any = values[1];

                console.log(group);
                console.log(user);

                group.addGroupModerator(user, function (err: Error) {
                    console.log("TEST");
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Moderator", ErrorType.DATABASE_INSERTION);
                        return res.status(500).send(msg);
                    } else {
                        return res.status(204).send();
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        public removeModerator = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;
            let username = req.params.username;

            Promise.all([this.getGroup(groupId), this.userService.getUser(username)]).then(values => {
                let group: any = values[0];
                let user: any = values[1];

                group.removeGroupModerator(user, function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("Moderator", ErrorType.DATABASE_DELETE);
                        return res.status(500).send(msg);
                    } else {
                        return res.status(204).send();
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        public getMemberProducts = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;
            let username = req.params.username;

            Promise.all([this.getGroup(groupId), this.userService.getUser(username)]).then(values => {
                let group: any = values[0];
                let user: any = values[1];

                group.hasMembers(user, function (err: Error) {
                    if (err) {
                        let msg = ErrorHandler.getErrorMsg("User is not a member of the group", null);
                        return res.status(500).send(msg);
                    } else {
                        // TODO: Check that this is correct (assuming user belongs only to one group)
                        user.getProducts(function (err: Error, prods: any) {
                            return res.status(200).send(prods);
                        });
                    }
                });
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        private getGroup = (groupId: Number) => {
            return new Promise((resolve, reject) => {
                this.groupModel.one({ id: groupId }, function (err: Error, group: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Group data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!group) {
                        let errorMsg = ErrorHandler.getErrorMsg("Group", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(group);
                    }
                });
            });
        }
    }
}

export = Route;