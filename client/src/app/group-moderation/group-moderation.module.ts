import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupModerationRouterModule } from "./group-moderation-router.module"

import { GroupListingComponent } from "./group-listing/group-listing.component";
import { GroupDetailsComponent } from "./group-details/group-details.component";
import { GroupCheckoutPageComponent } from "./group-checkout-page/group-checkout-page.component";


import { GroupModerationService } from "./shared/group-moderation.service";


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GroupCheckoutPageComponent,
    GroupListingComponent,
    GroupDetailsComponent
  ],
  providers:[
    GroupModerationService
  ]
})
export class GroupModerationModule { }
