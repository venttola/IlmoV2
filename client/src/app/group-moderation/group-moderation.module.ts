import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupModerationRouterModule } from "./group-moderation-router.module"

import { GroupListingComponent } from "./group-listing/group-listing.component";
import { GroupPageComponent } from "./group-page/group-page.component";
import { GroupCheckoutPageComponent } from "./group-checkout-page/group-checkout-page.component";


import { GroupModerationService } from "./group-listing/group-moderation.service";


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GroupCheckoutPageComponent,
    GroupListingComponent,
    GroupPageComponent
  ],
  providers:[
    GroupModerationService
  ]
})
export class GroupModerationModule { }
