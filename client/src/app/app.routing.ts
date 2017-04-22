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
                                 UserSettingsComponent];
