import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { PublicRouterModule } from "./public.router.module";

import { FrontPageComponent } from "./front-page/front-page.component";
import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SignupComponent } from "./signup/signup.component";

import { LoginService } from "./login/login.service";
import { ForgotPasswordService } from "./forgot-password/forgot-password.service";
import { ResetPasswordService } from "./reset-password/reset-password.service";
import { SignupService } from "./signup/signup.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PublicRouterModule
  ],
  declarations: [
    FrontPageComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignupComponent
  ],
  providers: [
    LoginService,
    ForgotPasswordService,
    ResetPasswordService,
    SignupService
  ]
})
export class PublicModule { }
