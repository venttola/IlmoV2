import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { UsersRouterModule } from "./users.router.module";

import { UsersComponent } from "./users.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";
import { PasswordChangeComponent } from "./password-change/password-change.component";
import { PasswordChangeService } from "./password-change/password-change.service";
import { UserSettingsService } from "./user-settings/user-settings.service"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UsersRouterModule
  ],
  declarations: [
  	PasswordChangeComponent,
  	UsersComponent,
    UserSettingsComponent
  ],
  providers: [
    PasswordChangeService,
  	UserSettingsService
  ]
})
export class UsersModule { }
