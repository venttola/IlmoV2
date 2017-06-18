import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable()
export class GroupModeratorGuard implements CanActivate {

  constructor(private authService: AuthService,
  			  private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
    if (!this.authService.loggedIn() || !this.authService.isModerator(route.params["groupId"])) {
      this.router.navigate(["main"]);
      return false;
    }
    return true;
  }

}
