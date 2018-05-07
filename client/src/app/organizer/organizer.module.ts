import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizerRouterModule } from "./organizer-router.module";

import { OrganizerComponent } from './organizer.component';

@NgModule({
  imports: [
    CommonModule,
    OrganizerRouterModule
  ],
  declarations: [
    OrganizerComponent,
  ]
})
export class OrganizerModule { }
