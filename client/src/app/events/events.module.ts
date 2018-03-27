import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { EventsRouterModule } from "./events-router.module";

import { EventListingComponent } from './event-listing/event-listing.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventSignupComponent } from './event-signup/event-signup.component';
import { EventSignupListingComponent } from "./event-signup-listing/event-signup-listing.component"
import { ProductRowComponent } from './event-signup/product-row/product-row.component';
import { GroupModalComponent } from './event-details/group-modal/group-modal.component';

import { EventDetailsService } from "./event-details/event-details.service";
import { EventSignupService } from "./event-signup/event-signup.service";

import { ParticipantGroupService } from "./event-details/participant-group.service";
import { SignupListingService } from "./event-signup-listing/signup-listing.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EventsRouterModule
  ],
  declarations: [
    EventDetailsComponent,
    EventListingComponent,
    EventSignupComponent,
    EventSignupListingComponent,
    ProductRowComponent,
    GroupModalComponent
  ],
  providers: [
    EventListingComponent,
    EventDetailsService,
    EventSignupService,
    ParticipantGroupService,
    SignupListingService
  ]
})
export class EventsModule { }
