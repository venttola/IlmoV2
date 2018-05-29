import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { GroupModerationRouterModule } from "./group-moderation-router.module";
import { SharedModule } from "../shared/shared.module";

import { CheckoutComponent } from "./checkout/checkout.component";
import { GroupModerationComponent } from "./group-moderation.component";
import { GroupDetailRowComponent } from "./group-detail-row/group-detail-row.component";
import { GroupListingComponent } from "./group-listing/group-listing.component";
import { GroupOverviewComponent } from "./group-overview/group-overview.component";
import { GroupDetailsComponent } from "./group-details/group-details.component";
import { GroupSignupsComponent } from "./group-signups/group-signups.component";
import { ParticipantAddingComponent } from "./participant-adding/participant-adding.component";


import { GroupModerationService } from "./shared/group-moderation.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    GroupModerationRouterModule
  ],
  declarations: [
    CheckoutComponent,
    GroupDetailsComponent,
    GroupDetailRowComponent,
    GroupListingComponent,
    GroupModerationComponent,
    GroupOverviewComponent,
    GroupSignupsComponent,
    ParticipantAddingComponent
  ],
  providers:[
    GroupModerationService
  ]
})
export class GroupModerationModule { }
