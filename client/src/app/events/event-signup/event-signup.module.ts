import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventSignupComponent } from './event-signup.component';
import { ProductRowComponent } from './product-row/product-row.component';

import { EventSignupService } from "./event-signup.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
   EventSignupComponent,
   ProductRowComponent
  ],
  providers: [
    EventSignupService
  ]
})
export class EventSignupModule { }
