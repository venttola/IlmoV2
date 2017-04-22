import { Component, Input, OnInit, SimpleChange } from "@angular/core";
import { Router } from '@angular/router';

//import { AuthService } from "../authentication/auth.service";

@Component({
    moduleId: module.id,
    selector: "front-page",
    templateUrl: "front-page.component.html"
})
export class FrontPageComponent implements OnInit {
    error: any;
    loginOpen: boolean;
    signupOpen: boolean;
    frontPageOpen: boolean;

    constructor() {
      this.loginOpen = false;
      this.signupOpen = false; 
      this.frontPageOpen = false;

    }

    ngOnInit(): void {
        console.log("Loading Loginhandler");
        //this.authService.logout();
    }
    openLogin():void {
        this.loginOpen = true;
        this.signupOpen = false;
        this.frontPageOpen = false;
    }
    openSignup(): void {
        this.signupOpen = true;
        this.loginOpen = false;
        this.frontPageOpen = false;
    }
    openFrontPage(): void {
        this.frontPageOpen = true;
        this.signupOpen = false;
        this.loginOpen = false;
    }
       
    
}