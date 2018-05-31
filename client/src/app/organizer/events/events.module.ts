import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRouterModule } from "./events-router.module";

import { EventsComponent } from './events.component';
import { EventOverviewComponent } from "./event-overview/event-overview.component";

import { EventsService } from "./events.service";

@NgModule({
  imports: [
    CommonModule,
    EventsRouterModule
  ],
  declarations: [
    EventsComponent,
    EventOverviewComponent
  ],
  providers: [
    EventsService
  ]
})
export class EventsModule { }
