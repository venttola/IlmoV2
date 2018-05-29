import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRouterModule } from "./events-router.module";

import { EventsComponent } from './events.component';

@NgModule({
  imports: [
    CommonModule,
    EventsRouterModule
  ],
  declarations: [EventsComponent]
})
export class EventsModule { }
