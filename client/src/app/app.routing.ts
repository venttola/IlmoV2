import  { ModuleWithProviders } from "@angular/core";

import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthGuard } from "./authentication/auth-guard.service";
import { AdminGuard } from "./authentication/admin-guard.service";


import { FrontPageComponent } from "./front-page/front-page.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { EventSignupComponent } from "./event-signup/event-signup.component";
import { EventManagementComponent } from "./admin-page/event-management/event-management.component";
import { EventSignupListingComponent } from "./event-signup-listing/event-signup-listing.component";
import { GroupModerationComponent } from "./group-moderation/group-moderation.component";
import { GroupPageComponent } from "./group-moderation/group-page/group-page.component";

const appRoutes: Routes = [
  {
    path: "",
    component: FrontPageComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
  	path: "main",
  	component: MainPageComponent,
  	canActivate: [AuthGuard]
  },
  {
    path: "admin",
    component: AdminPageComponent,
    canActivate: [AdminGuard] 
  },
  {
    path: "settings",
    component: UserSettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "events/:id",
    component: EventDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "events/:eventId/group/:groupId",
    component: EventSignupComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "events/:eventId/manage",
    component: EventManagementComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "signups",
    component: EventSignupListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "moderation",
    component: GroupModerationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "groups/:groupId",
    component: GroupPageComponent,
    canActivate: [AuthGuard] // TODO: Change to ModeratorGuard
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

export const RoutedComponents = [FrontPageComponent, 
								                 MainPageComponent,  
                                 AdminPageComponent,
                                 LoginComponent,
                                 SignupComponent,
                                 UserSettingsComponent,
                                 EventDetailsComponent,
                                 EventManagementComponent];
