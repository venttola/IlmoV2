import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class OrganizerGuard {

   constructor(private authService: AuthService,
               private router: Router) {}

  canActivate() {
    if (!this.authService.isOrganizer()) {
      this.router.navigate([""]);
      return false;
    }
    return true;
  }
  canActivateChild() {
    if (!this.authService.isOrganizer()) {
      this.router.navigate([""]);
      return false;
    }
    return true;
  }

}
