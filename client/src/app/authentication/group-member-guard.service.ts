import { Injectable } from '@angular/core';
import { Router, CanActivate } from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable()
export class GroupMemberGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (!this.authService.loggedIn()) {
      this.router.navigate(["main"]);
      return false;
    }
    return true;
  }

}
