import { Component, Input, OnInit, SimpleChange } from "@angular/core";
import { Router } from '@angular/router';

import { Credentials } from "./credentials.model";
import { SignupData } from "./signupdata.model";

import { LoginService } from "./login.service";
import { SignupService } from "./signup.service";
import { AuthService } from "../authentication/auth.service";

@Component({
    moduleId: module.id,
    selector: "login",
    templateUrl: "login-page.component.html"
})
export class LoginPageComponent implements OnInit {
    @Input() credentials: Credentials;
    @Input() signupData: SignupData;
    error: any;
    matchListOpen: boolean;
    scoreBoardOpen: boolean;

    constructor(private loginService : LoginService,
                private signupService: SignupService,
                private authService: AuthService,
                private router: Router) {

    }

    ngOnInit(): void {
        console.log("Loading Loginhandler");
        this.credentials = new Credentials();
        this.signupData = new SignupData();
        this.authService.logout();
    }

    attemptLogin(): void {
       console.log("Logging in");
       if(this.credentials.email && this.credentials.password){
           this.
           loginService.
           sendLoginRequest(this.credentials).
           then(response => {
             console.log("Logged in");
             this.authService.login();
            }).
           catch(error => {
             this.error = error
             alert(error._body);
             this.credentials.password="";
           });
       } else {
           //Notify user to provide credentials
           console.error("No credentials!");
       }
    }

    attemptSignup(): void {
        console.log("Signing up");
        if (this.signupData.allPresent()){
            this.signupService.sendSignupRequest(this.signupData).
            then(response => {
              console.log("Signed up");
              this.signupData = new SignupData();
            }).catch(error => {
              this.error = error
              alert(error._body);
            });
        }
       
    }
}