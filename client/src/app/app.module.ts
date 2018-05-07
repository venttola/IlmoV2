import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { BootstrapModalModule } from "ng2-bootstrap-modal";

import { AdminDashboardModule } from "./admin-dashboard/admin-dashboard.module";
import { EventsModule } from "./events/events.module";
import { GroupModerationModule } from "./group-moderation/group-moderation.module";
import { OrganizerModule } from "./organizer/organizer.module";
import { PublicModule } from "./public/public.module";
import { SharedModule } from './shared/shared.module';
import { UsersModule } from "./users/users.module";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from './app-routing.module';


import { AuthService } from "./authentication/auth.service";
import { AuthGuard } from "./authentication/auth-guard.service";
import { AdminGuard } from "./authentication/admin-guard.service";
import { GroupModeratorGuard } from "./authentication/group-moderator-guard.service";




@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    NgbModule.forRoot(),
    FormsModule,
    BootstrapModalModule,
    AdminDashboardModule,
    EventsModule,
    GroupModerationModule,
    OrganizerModule,
    PublicModule,
    SharedModule,
    UsersModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    GroupModeratorGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
