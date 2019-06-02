import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { SharedModule } from "../shared/shared.module";

import { EventsRouterModule } from "./events-router.module";

import { EventsComponent } from "./events.component";
import { EventListingComponent } from './event-listing/event-listing.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventSignupComponent } from './event-signup/event-signup.component';


import { EventDetailsService } from "./event-details/event-details.service";
import { EventService } from "./shared/event.service";
import { EventSignupService } from "./event-signup/event-signup.service";

import { ParticipantGroupService } from "./event-details/participant-group.service";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    EventsRouterModule
  ],
  declarations: [
    EventsComponent,
    EventDetailsComponent,
    EventListingComponent,
    EventSignupComponent
  ],
  providers: [
    EventDetailsService,
    EventListingComponent,
    EventService,
    EventSignupService,
    ParticipantGroupService
  ]
})
export class EventsModule { }
