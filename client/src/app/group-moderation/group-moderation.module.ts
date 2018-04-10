import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { GroupModerationRouterModule } from "./group-moderation-router.module";
import { SharedModule } from "../shared/shared.module";

import { GroupModerationComponent } from "./group-moderation.component"; 
import { GroupListingComponent } from "./group-listing/group-listing.component";
import { GroupDetailsComponent } from "./group-details/group-details.component";
import { CheckoutComponent } from "./checkout/checkout.component";


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
    GroupListingComponent,
    GroupModerationComponent
  ],
  providers:[
    GroupModerationService
  ]
})
export class GroupModerationModule { }
