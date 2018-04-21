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
        this.transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: config.get("email"), // generated ethereal user
              pass: config.get("email_password") // generated ethereal password
          }
        });
        this.handlebarsOptions = {
          viewEngine: "handlebars",
          viewPath: path.resolve("./src/services/mailtemplates/"),
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
            }
            let token: string = buffer.toString("hex");
            let mailOptions = {
              from: "\"Ilmoportaali\" <ilmoportaali@sotahuuto.fi>", // sender address
              to: email, // list of receivers
              subject: "Ilmoportaalin salasanan resetointi", // Subject line
              template: "forgot-password-email",
              context: {
                 url: config.get("domain") + "/reset_password?token=" + token,
                 name: user.firstname + " " + user.lastname
              }
            };
            self.transporter.sendMail(mailOptions, (error: any, info: any) => {
              if (!error) {
                return resolve();
              } else {
                let errorMsg = "Reset mail sending failed!";
                return reject(new APIError(500, errorMsg));
              }
            });
          });
      }).catch((error:any) => {
        let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
        reject(new DatabaseError(404, errorMsg));
      });
  });
   }

  }
}

export = Service;