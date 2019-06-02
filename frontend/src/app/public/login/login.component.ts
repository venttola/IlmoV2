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
  errorMessage: string;
  constructor(private loginService: LoginService,
    private authService: AuthService) { 
    this.errorMessage = "";
  }

  ngOnInit() {
    this.credentials = new Credentials();
  }
  attemptLogin(): void {
    console.log("Logging in");
    if(this.credentials.email && this.credentials.password){
      this.
      loginService.
      sendLoginRequest(this.credentials).
      subscribe(response => {
       //let token = response.token;
        this.authService.saveToken(this.credentials.email, response.token);
        this.authService.login();
      }, error => {
        if (error.status === 400){
           this.errorMessage = "Käyttäjänimeä ei löytynyt!";
        }
        else if (error.status === 403) {
          this.errorMessage = "Virheellinen salasana!";
        }
       
        this.credentials.password="";
      });
    } else {
      //Notify user to provide credentials
      this.errorMessage = "Anna käyttäjätunnus ja salasana.";
    }
  }

}
