import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { tokenNotExpired } from "angular2-jwt";

@Injectable()
export class AuthService {
  
  constructor(private router: Router) {

  }
  saveToken(user: any, token: any): void{
    console.log(user, token);
    localStorage.setItem("id_token", token);
    localStorage.setItem("user", user);

  }
  login(): void {
  //  this.lock.show();
    console.log("Rerouting to main page");
    this.router.navigateByUrl("main")
  }

  logout(): void {
    // To log out, just remove the token and profile
    // from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("id_token");

    // Send the user back to the dashboard after logout
    this.router.navigateByUrl("");
  }

  loggedIn(): boolean {
    return tokenNotExpired(null, localStorage.getItem("id_token"));
  }

  isAdmin(): boolean {
    return true;
  }
}