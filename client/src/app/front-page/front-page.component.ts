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

    constructor() {
      this.loginOpen = true;
      this.signupOpen = false; 

    }

    ngOnInit(): void {
        console.log("Loading Loginhandler");
        //this.authService.logout();
    }
       
    
}