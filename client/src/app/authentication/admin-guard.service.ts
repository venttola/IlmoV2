import { Injectable } from "@angular/core";
import { Router, CanActivate, CanActivateChild } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService,
  			  private router: Router) {}

  canActivate() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(["main"]);
      return false;
    }
    return true;
  }
  canActivateChild() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(["main"]);
      return false;
    }
    return true;
  }
}