"use strict";

import * as express from "express";
import { DatabaseHandler } from "../models/databasehandler";

import * as bcrypt from "bcrypt";

import * as jwt from "jsonwebtoken";
module Route {

  export class AuthRoutes {
    constructor(private handler: DatabaseHandler,
                private superSecret: string,
                private saltRounds: number) {
      console.log("Creating authroutes");
    }
  	 /**
     * @api {post} api/login/ Get list of all ships
     * @apiName login
     * @apiGroup Login
     * @apiParam {JSON} username {username: "username"}
     * @apiParam {JSON} password {password: "password"}
     * @apiSuccess -
     * @apiError {} Missing Fields
     */
    public login = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(req.body);
      console.log (req.body.email);
      console.log(req.body.password);
      let self = this;
      let email: string = req.body.email;
			//let password: string = new Buffer(req.body.password, "base64").toString();
      let password: string = req.body.password;
      let superSecret: string = this.superSecret;
      let userModel = this.handler.getModels().User;
			console.log (email + ":" + password);
      if (!email) {
				return res.status(400).send("Error: Missing username!\n");
			} else if (!password) {
				return res.status(400).send("Error: Missing password!\n");
			}
      userModel.one({email: email}, function(err: any, result: any) {
               if (!result) {
                 return res.status(400).send("Error: Username not found!\n");
               } else {
                 bcrypt.compare(password, result.password, function(err: any, success: any){
                   if (success) {
                     //Create the token for auth
                     // let options: JSON = JSON.parse("expiresInMinutes: 1440")
                     let token = jwt.sign(email, superSecret);
                     let response: any = JSON.stringify( {succes: true,
                                                       message: "Login successfull",
                                                       token: token});
                     res.header("Content-Type", "application/json");
                     return res.json(response);
                   } else {
                     return res.status(403).send("Error: Incorrect password!\n");
                   }
                 });
               }
            });
    }
     /**
     * @api {post} api/signup/ Lisää uuden käyttäjän tietokantaan
     * @apiName signup
     * @apiGroup Login
     * @apiParam {JSON} email {email: ""}
     * @apiParam {JSON} password {password: ""}
     * @apiParam {JSON} firstname {firstname: ""}
     * @apiParam {JSON} lastname {lastname: ""}
     * @apiParam {JSON} dob { }
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
      //let self = this;
      let email: string = req.body.email;
      //let password: string = new Buffer (req.body.password, "base64").toString();
      let password: string = req.body.password;
      let firstname: string = req.body.firstname;
      let lastname: string = req.body.lastname;
      let dob: string = req.body.dob;
      let userModel = this.handler.getModels().User;
      let saltRounds: number = this.saltRounds;
      console.log("Checking username " + email);
      console.log("Amount of saltRounds. " + this.saltRounds);
      userModel.one({email: email}, function(err: any, user: any){
        console.log("Result of user query: " + user);
        if (user) {
          return res.status(400).send("Error: Username in use \n");
        } else {
          bcrypt.hash(password, saltRounds, function(err: any, hash: any) {
            if (err) {
              console.log(err);
            } else {
              userModel.create({
                email: email,
                password: hash ,
                firstname: firstname,
                lastname: lastname,
                dob: new Date(dob),
                allergies: ""
              }, function(err: any, result: any){
                if (err) {
                  console.log("Error creating user: " + err);
                  // TODO: Proper response
                } else {
                  return res.status(201).send("User added!");
                }
              });
            }
          });
        }
      });
    }
  }
}
export = Route;