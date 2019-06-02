import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";
import * as config from "config";
import * as path from "path";
var hbs = require("nodemailer-express-handlebars");

import { UserService } from "./userservice";
module Service {
  export class MailerService {
    private transporter: any;
    private handlebarsOptions: any;
    constructor(private userService: UserService) {

    // create reusable transporter object using the default SMTP transport
      let authOptions = config.get("email_auth");
      this.transporter = nodemailer.createTransport({
        host: config.get("email_host"),
        port: config.get("email_port"),
        secure: config.get("email_secure"), // true for 465, false for other ports
        auth: authOptions
      });
      this.handlebarsOptions = {
        viewEngine: "handlebars",
        viewPath: path.resolve("./mailtemplates/"),
        extName: ".html"
      };
      this.transporter.use("compile", hbs(this.handlebarsOptions));
    }
    public sendPasswordResetLink = (email: string) => {
      let self = this;
      return new Promise((resolve, reject) => {
        self.userService.getUser(email).then((user: any) => {
          crypto.randomBytes(20, function(err: any, buffer: any) {
            if (err) {
              reject(new APIError(500, "Unexpected error"));
            }
            let token: string = buffer.toString("hex");
            user.passwordResetToken = token;
            let expires: number = Date.now() + 86400000;
            console.log(expires);
            user.passwordResetExpires = expires;
            user.save(function (err: Error) {
              if (err)   {
                reject(new DatabaseError(500, "User update failed!"));
              }
              let mailOptions = {
                from: "\"Ilmoportaali\" <ilmoportaali@sotahuuto.fi>", // sender address
                to: email, // list of receivers
                subject: "Ilmoportaalin salasanan resetointi", // Subject line
                template: "forgot-password-email",
                context: {
                  url: config.get("domain") + "/resetpassword?token=" + token,
                  name: user.firstname + " " + user.lastname
                }
              };
              self.transporter.sendMail(mailOptions, (error: any, info: any) => {
                if (!error) {
                  return resolve();
                } else {
                  console.log(error);
                  let errorMsg = "Reset mail sending failed!";
                  return reject(new APIError(500, errorMsg));
                }
              });
            });
          });
        }).catch((error: any) => {
          let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
          reject(new DatabaseError(404, errorMsg));
        });
      });
    }
    public sendPasswordResetNotification = (email: string) => {
      let self = this;
      return new Promise((resolve, reject) => {
        self.userService.getUser(email).then((user: any) => {
          let mailOptions = {
              to: user.email,
              from: "\"Ilmoportaali\" <ilmoportaali@sotahuuto.fi>", // sender address,
              template: "reset-password-email",
              subject: "Salasanan resetointi onnistui!",
              context: {
                name:   user.firstname + " " + user.lastname
              }
            };
            self.transporter.sendMail(mailOptions, function(error: any) {
              if (!error) {
                  return resolve();
                } else {
                  let errorMsg = "Reset mail sending failed!";
                  return reject(new APIError(500, errorMsg));
                }
            });
        }).catch((error: any) => {
          let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
          reject(new DatabaseError(404, errorMsg));
        });
      });
    }
  }
}

export = Service;