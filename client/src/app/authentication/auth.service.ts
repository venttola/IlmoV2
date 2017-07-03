import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { tokenNotExpired, JwtHelper } from "angular2-jwt";

@Injectable()
export class AuthService {
  jwtHelper: JwtHelper;
  constructor(private router: Router) {
    this.jwtHelper = new JwtHelper();
  }
  public saveToken(user: any, token: any): void{
    console.log(user, token);
    localStorage.setItem("id_token", token);
    localStorage.setItem("user", user);
    console.log(this.jwtHelper.decodeToken(localStorage.getItem("id_token")));
  }
  public login(): void {
    //  this.lock.show();
    console.log("Rerouting to main page");
    this.router.navigateByUrl("main")
  }

  public logout(): void {
    // To log out, just remove the token and profile
    // from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("id_token");

    // Send the user back to the dashboard after logout
    this.router.navigateByUrl("");
  }

  public loggedIn(): boolean {
    return tokenNotExpired(null, localStorage.getItem("id_token"));
  }

  public isAdmin(): boolean {
    if(localStorage.getItem("id_token")){
      let token = this.jwtHelper.decodeToken(localStorage.getItem("id_token"));
      return token.admin && this.loggedIn();
    }
    else {
      return false;
    }
  }
  public getModeratedGroups(): any[] {
    if(localStorage.getItem("id_token")){
      let token = this.jwtHelper.decodeToken(localStorage.getItem("id_token"));
      return JSON.parse(token.moderatedGroups);
    }
    else {
      return [];
    }
  }
  public getOrganizationMemberships(): any[] {
    if(localStorage.getItem("id_token")){
      let token = this.jwtHelper.decodeToken(localStorage.getItem("id_token"));
      return JSON.parse(token.organizationMemberships);
    }
    else {
      return [];
    }
  }
  public isModerator(groupId: number): boolean {
    return this.getModeratedGroups().some(group => group.id == groupId);
  }
  public isOrganizer(organizationId: number): boolean {
     return this.getOrganizationMemberships().some(organization => organization.id == organizationId);
  }
}