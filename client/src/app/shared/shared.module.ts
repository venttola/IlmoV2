import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { EventService } from './event.service';
import { EventListingComponent } from './event-listing/event-listing.component';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EventListingComponent
  ],
  providers: [
    EventService
  ],
  exports: [
    EventListingComponent,
    FormsModule
  ]
})
export class SharedModule { }
