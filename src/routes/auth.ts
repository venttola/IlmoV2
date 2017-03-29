"use strict";

import Promise from "ts-promise";
import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { DatabaseHandler } from "../models/databasehandler";
module Route {

    export class AuthRoutes {
        constructor(private handler: DatabaseHandler,
            private superSecret: string,
            private saltRounds: number) {
            console.log("Creating authroutes");
        }
        /**
        * @api {post} api/login/ Check the user credentials against the database.
        * @apiName login
        * @apiGroup Auth
        * @apiParam {JSON} username {username: "username"}
        * @apiParam {JSON} password {password: "password"}
        * @apiSuccess {JSON} 
        * @apiError {} Missing Fields
        */
        public login = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.body);
            console.log(req.body.email);
            console.log(req.body.password);
            let self = this;
            let email: string = req.body.email;
            //let password: string = new Buffer(req.body.password, "base64").toString();
            let password: string = req.body.password;
            let superSecret: string = this.superSecret;
            let userModel = this.handler.getModels().User;
            console.log(email + ":" + password);
            if (!email) {
                return res.status(400).send("Error: Missing username!\n");
            } else if (!password) {
                return res.status(400).send("Error: Missing password!\n");
            }

            userModel.one({ email: email }, function (err: any, result: any) {
                if (!result) {
                    return res.status(400).send("Error: Username not found!\n");
                } else {
                    bcrypt.compare(password, result.password, function (err: any, success: any) {
                        if (success) {
                            self.checkIfAdmin(result).then((isAdmin: any) => {
                                //Create the token for auth
                                // let options: JSON = JSON.parse("expiresInMinutes: 1440")

                                let userInfo = {
                                    "email": email,
                                    "admin": isAdmin
                                };

                                let token = jwt.sign(userInfo, superSecret);

                                let response: any = JSON.stringify({
                                    success: true,
                                    message: "Login successfully",
                                    token: token
                                });

                                res.header("Content-Type", "application/json");
                                return res.json(response);
                            });

                        } else {
                            return res.status(403).send("Error: Incorrect password!\n");
                        }
                    });
                }
            });
        }
        /**
        * @api {post} api/signup/ Adds new user to the database
        * @apiName signup
        * @apiGroup Login
        * @apiParam {JSON} email {email: "prettyboy88@hotmail.com"}
        * @apiParam {JSON} password {password: "password"}
        * @apiParam {JSON} firstname {firstname: "Matti"}
        * @apiParam {JSON} lastname {lastname: "Meikalainen"}
        * @apiParam {JSON} dob {dob: "20.12.1988"}
        * @apiSuccess -
        * @apiError  Missing fields 
        */
        public signup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.body);
            console.log(req.body.email);
            if (!req.body.email ||
                !req.body.password ||
                !req.body.firstname ||
                !req.body.lastname ||
                !req.body.dob) {
                return res.status(400).send("Error: Missing data \n");
            }
            let self = this;
            let email: string = req.body.email;
            //let password: string = new Buffer (req.body.password, "base64").toString();
            let password: string = req.body.password;
            let firstname: string = req.body.firstname;
            let lastname: string = req.body.lastname;
            let dob: Date = self.stringToDate(req.body.dob);
            console.log(dob);
            let userModel = this.handler.getModels().User;
            let saltRounds: number = this.saltRounds;
            console.log("Checking username " + email);
            console.log("Amount of saltRounds. " + this.saltRounds);
            userModel.one({ email: email }, function (err: any, user: any) {
                console.log("Result of user query: " + user);
                if (user) {
                    return res.status(400).send("Error: Username in use \n");
                } else {
                    bcrypt.hash(password, saltRounds, function (err: any, hash: any) {
                        if (err) {
                            console.log(err);
                        } else {
                            userModel.create({
                                email: email,
                                password: hash,
                                firstname: firstname,
                                lastname: lastname,
                                dob: new Date(dob),
                                allergies: ""
                            }, function (err: any, result: any) {
                                if (err) {
                                    console.log("Error creating user: " + err);
                                    // TODO: Proper response
                                    // It's not a final one, but it's good to let the user know something went wrong.
                                    return res.status(400).send("Failed to add user:" + err);
                                } else {
                                    return res.status(201).send("User added!");
                                }
                            });
                        }
                    });
                }
            });
        }

        private checkIfAdmin = (user: any) => {
            return new Promise((resolve, reject) => {
                user.hasAdmin(function (err: any, isAdmin: Boolean) {
                    if (err && err.literalCode !== "NOT_FOUND") {
                        console.log("ERROR OCCURED: " + err);
                        return reject(err);
                    } else {
                        console.log("User '" + user.email + "' admin status: " + isAdmin);
                        return resolve(isAdmin);
                    }
                });
            });
        }
        private stringToDate = (dateStr: string): Date => {
            let splitDob: any = dateStr.split(".");
            return new Date(splitDob[2], splitDob[1] - 1, splitDob[0]);
        }
    }
}
export = Route;