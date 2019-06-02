"use strict";

//import Promise from "ts-promise";
import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AuthService } from "../services/authservice";
import { MailerService } from "../services/mailerservice";

import { DatabaseHandler } from "../databasehandler";

import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
module Route {

    export class AuthRoutes {
        constructor(private superSecret: string,
                    private saltRounds: number,
                    private userModel: any,
                    private authService: AuthService,
                    private mailerService: MailerService) {
            console.log("Creating authroutes");
        }
        /**
        * @api {post} api/login/ Check the user credentials against the database.
        * @apiName login
        * @apiGroup Auth
        * @apiParam {JSON} username {username: "username"}
        * @apiParam {JSON} password {password: "password"}
        * @apiSuccess {JSON} response {
                                    success: true,
                                    message: "Login successfully",
                                    token: token}
        * @apiError {JSON} Missing Fields
        */
        public login = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let self = this;
            let email: string = req.body.email;
            let password: string = req.body.password;
            if (!email) {
                return res.status(400).send("Error: Missing username!\n");
            } else if (!password) {
                return res.status(400).send("Error: Missing password!\n");
            }

            self.userModel.one({ email: email }, function (err: any, result: any) {
                if (!result) {
                    return res.status(400).send("Error: Username not found!\n");
                } else {
                    bcrypt.compare(password, result.password, function (err: any, success: any) {
                        if (success) {
                            Promise.all([self.authService.checkIfAdmin(email),
                                         self.authService.getModeratedGroups(email),
                                         self.authService.getOrganizationMemberships(email)]).
                                         then((values: any) => {
                                    let isAdmin = values[0];
                                    let moderatedGroups = values[1];
                                    let organizationMemberships = values[2];
                                    //Create the token for auth
                                    let options: any =  {"expiresIn": "2h"};

                                    let userInfo: any = {
                                        "id": result.id,
                                        "email": email,
                                        "admin": isAdmin,
                                        "moderatedGroups": JSON.stringify(moderatedGroups),
                                        "organizationMemberships": JSON.stringify(organizationMemberships)
                                    };
                                    jwt.sign(userInfo, self.superSecret, options, function(err: any, token: any ){
                                        if (err) {
                                            console.log(err);
                                             return res.status(500).send(err);

                                        } else {
                                            let response: any = JSON.stringify({
                                                success: true,
                                                token: token
                                            });
                                            res.header("Content-Type", "application/json");
                                            return res.json(response);
                                        }
                                    });
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
        * @apiSuccess 201
        * @apiError 400 {JSON} Missing fields 
        * @apiError 500 {JSON} Missing fields
        * @apiError 409 {JSON} Username in use 
        */
        public signup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let self = this;
            console.log(req.body.email);
            if (!req.body.email ||
                !req.body.password ||
                !req.body.firstname ||
                !req.body.lastname ||
                !req.body.dob) {
                return res.status(400).send("Error: Missing data \n");
            }
            let email: string = req.body.email;
            let password: string = req.body.password;
            let firstname: string = req.body.firstname;
            let lastname: string = req.body.lastname;
            let phone: string = req.body.phone;
            let dob: string = req.body.dob;
            let saltRounds: number = this.saltRounds;
            self.userModel.one({ email: email }, function (err: any, user: any) {
                if (user) {
                    return res.status(409).send("Error: Username in use \n");
                } else {
                    bcrypt.hash(password, saltRounds, function (err: any, hash: any) {
                        if (err) {
                             return res.status(500).send("Error: Password saving failed \n");
                        } else {
                            self.userModel.create({
                                email: email,
                                password: hash,
                                firstname: firstname,
                                lastname: lastname,
                                dob: dob,
                                allergies: "",
                                phone: phone
                            }, function (err: any, result: any) {
                                if (err) {
                                    console.log("Error creating user: " + err);
                                    // TODO: Proper response
                                    // It's not a final one, but it's good to let the user know something went wrong.
                                    return res.status(500).send("Failed to add user:" + err);
                                } else {
                                    console.log("Added user: " + result.email);
                                    let response = JSON.stringify({"id": result.id, "email": result.email});
                                    return res.status(201).json(response);
                                }
                            });
                        }
                    });
                }
            });
        }
        public requestPasswordReset = (req: express.Request, res: express.Response, next: express.NextFunction) => {
          let self = this;
          let email = req.body.email;
          self.mailerService.sendPasswordResetLink(email).then((response: any) => {
            return res.status(200).send();
          }).catch((err: APIError) => {
            return res.status(err.statusCode).send(err.message);
          });
        }
         public resetPassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
          let self = this;
          let token = req.body.token;
          let password = req.body.password;
          let verifyPassword = req.body.verifyPassword;
          let saltRounds: number = this.saltRounds;
          self.userModel.one({ passwordResetToken: token }, function (err: any, user: any) {
                if (!user) {
                    return res.status(404).send("User not found!");
                } else {
                    //We could tell the user if the reset request has timed out.
                    if (user.passwordResetExpires < Date.now() || password !== verifyPassword) {
                        return res.status(500).send("Error: Could not reset password.");
                    } else {
                        bcrypt.hash(password, saltRounds, function (err: any, hash: any) {
                            if (err) {
                                return res.status(500).send("Error: Password saving failed.");
                            } else {
                                user.password = hash;
                                user.passwordResetToken = undefined;
                                user.passwordResetExpires = undefined;
                                user.save( function (err: any, result: any) {
                                    if (err) {
                                        console.log("Error resetting: " + err);
                                        return res.status(500).send("Failed to reset password:" + err);
                                    } else {
                                        self.mailerService.sendPasswordResetNotification(user.email).then((response: any) => {
                                            return res.status(204).json({message: "Password reset succeeded"});
                                          }).catch((err: APIError) => {
                                            return res.status(err.statusCode).send(err.message);
                                          });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
}
export = Route;