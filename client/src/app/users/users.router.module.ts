import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { PasswordChangeComponent } from "./password-change/password-change.component";
import { SignupListingComponent } from "./signup-listing/signup-listing.component";
import { UsersComponent } from "./users.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";

import { AuthGuard } from "../authentication/auth-guard.service";
//Fix this
const usersRoutes: Routes = [
  {
    path: "user",
    component: UsersComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "settings",
        component: UserSettingsComponent
      },
      {
        path: "password",
        component: PasswordChangeComponent
      },
      {
        path: "signups",
        component: SignupListingComponent,
      },
  ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(usersRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UsersRouterModule { }
