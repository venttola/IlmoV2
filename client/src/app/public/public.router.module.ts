import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { FrontPageComponent } from "./front-page/front-page.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";

import { AuthGuard } from "../authentication/auth-guard.service";
//Fix this
const publicRoutes: Routes = [

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
  component: SignupComponent,
},
{
  path: "resetpassword",
  component: PasswordResetComponent
}
]  
;

@NgModule({
  imports: [
    RouterModule.forChild(publicRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PublicRouterModule { }
