import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

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
      }
/*      {
        path: "signups",
        component: EventSignupListingComponent,
      },*/
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
