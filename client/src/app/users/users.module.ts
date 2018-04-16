import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { UsersRouterModule } from "./users.router.module";

import { UsersComponent } from "./users.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";

import { UserSettingsService } from "./user-settings/user-settings.service"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UsersRouterModule
  ],
  declarations: [
  	UsersComponent,
    UserSettingsComponent
  ],
  providers: [
  	UserSettingsService
  ]
})
export class UsersModule { }
