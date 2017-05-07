import * as express from "express";
import Promise from "ts-promise";
import { UserService } from "../services/userservice";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Route {
    export class GroupRoutes {
        constructor(private groupModel: any, private userService: UserService) {

        }

        public getParticipantGroup = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;

            this.getGroup(groupId).then((group) => {
                return res.status(200).json(group);
            }).catch((err: APIError) => {
                return res.status(err.statusCode).send(err.message);
            });
        }

        /**
        * @api {post} api/group Adds new group
        * @apiName New group
        * @apiGroup Group
        * @apiParam {JSON} name {name: "Group name"}
        * @apiParam {JSON} description {description: "Group description"}
        * @apiSuccess (204) -
        * @apiError DatabaseInsertionError ERROR: Group data insertion failed
        */
        // public addGroup = (req: express.Request, res: express.Response) => {
        //     this.groupModel.create({
        //         name: req.body.name,
        //         description: req.body.description
        //     }, function (err: Error, group: any) {
        //         if (err) {
        //             let errorMsg = ErrorHandler.getErrorMsg("Group data", ErrorType.DATABASE_INSERTION);
        //             return res.status(500).send(errorMsg);
        //         } else {
        //             return res.status(204).send();
        //         }
        //     });
        // }

        /**
        * @api {delete} api/group/:group/:username
        * @apiName Remove a group member
        * @apiGroup Group
        * @apiParam {Number} group Group unique id
        * @apiParam {String} username Username (email)
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Group data could not be read from the database
        * @apiError DatabaseReadError ERROR: Group was not found
        * @apiError DatabaseReadError ERROR: User data could not be read from the database
        * @apiError DatabaseReadError ERROR: User was not found
        * @apiError DatabaseDeleteError ERROR: Member deletion failed
        */
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

        /**
        * @api {patch} api/group/:group/moderator
        * @apiName Add a group moderator
        * @apiGroup Group
        * @apiParam {Number} group Group unique id
        * @apiParam {JSON} username Username (email)
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Group data could not be read from the database
        * @apiError DatabaseReadError ERROR: Group was not found
        * @apiError DatabaseReadError ERROR: User data could not be read from the database
        * @apiError DatabaseReadError ERROR: User was not found
        * @apiError DatabaseUpdateError ERROR: Moderator insertion failed
        */
        public addModerator = (req: express.Request, res: express.Response) => {
            let groupId = req.params.group;
            let username = req.body.username;

            Promise.all([this.getGroup(groupId), this.userService.getUser(username)]).then(values => {
                let group: any = values[0];
                let user: any = values[1];

                group.addGroupModerator(user, function (err: Error) {
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

        /**
        * @api {delete} api/group/:group/:username/moderator
        * @apiName Remove a group moderator
        * @apiGroup Group
        * @apiParam {Number} group Group unique id
        * @apiParam {String} username Username (email)
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Group data could not be read from the database
        * @apiError DatabaseReadError ERROR: Group was not found
        * @apiError DatabaseReadError ERROR: User data could not be read from the database
        * @apiError DatabaseReadError ERROR: User was not found
        * @apiError DatabaseUpdateError ERROR: Moderator deletion failed
        */
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

        /**
        * @api {get} api/group/:group/:username/products
        * @apiName Ger product list of a specific user
        * @apiGroup Group
        * @apiParam {Number} group Group unique id
        * @apiParam {String} username Username (email)
        * @apiSuccess (204) -
        * @apiError DatabaseReadError ERROR: Group data could not be read from the database
        * @apiError DatabaseReadError ERROR: Group was not found
        * @apiError DatabaseReadError ERROR: User data could not be read from the database
        * @apiError DatabaseReadError ERROR: User was not found
        * @apiError DatabaseConstraintError ERROR: User is not a member of the group
        */
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