import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRouterModule } from "./events-router.module";

import { EventsComponent } from './events.component';
import { EventOverviewComponent } from "./event-overview/event-overview.component";

@NgModule({
  imports: [
    CommonModule,
    EventsRouterModule
  ],
  declarations: [
    EventsComponent,
    EventOverviewComponent
  ]
})
export class EventsModule { }
