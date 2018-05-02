import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { UsersRouterModule } from "./users.router.module";

import { UsersComponent } from "./users.component";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";
import { PasswordChangeComponent } from "./password-change/password-change.component";
import { SignupListingComponent } from "./signup-listing/signup-listing.component";

import { PasswordChangeService } from "./password-change/password-change.service";
import { SignupListingService } from "./signup-listing/signup-listing.service";
import { UserSettingsService } from "./user-settings/user-settings.service"



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UsersRouterModule
  ],
  declarations: [
  	PasswordChangeComponent,
    SignupListingComponent,
  	UsersComponent,
    UserDetailsComponent,
    UserSettingsComponent
  ],
  providers: [
    PasswordChangeService,
    SignupListingService,
  	UserSettingsService
  ]
})
export class UsersModule { }
