import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupModerationRouterModule } from "./group-moderation-router.module";

import { GroupModerationComponent } from "./group-moderation/group-moderation.component";
import { GroupPageComponent } from "./group-page/group-page.component";
import { GroupCheckoutPageComponent } from "./group-checkout-page/group-checkout-page.component";


import { GroupModerationService } from "./group-moderation/group-moderation.service";


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GroupCheckoutPageComponent,
    GroupModerationComponent,
    GroupPageComponent
  ],
  providers:[
    GroupModerationService
  ]
})
export class GroupModerationModule { }
