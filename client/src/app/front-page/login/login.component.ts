import { Component, Input, OnInit } from '@angular/core';

import { Credentials } from "./credentials.model";
import { LoginService } from "./login.service";
import { AuthService } from "../../authentication/auth.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() credentials: Credentials;
  error: any;
  constructor(private loginService: LoginService,
  			  private authService: AuthService) { }

  ngOnInit() {
  	 this.credentials = new Credentials();
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

}
