import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { EventDetailsService } from "./event-details.service";
import { EventDetails } from "./event-details.model";
import { Response } from "@angular/http";

import 'rxjs/add/operator/switchMap';
import { Platoon } from "./platoon.model";
import { ParticipantGroup } from "./participantgroup.model";
import { ModalDirective } from "ngx-bootstrap/modal";
import { GroupModalComponent } from "./group-modal/group-modal.component";
import { DialogService } from "ng2-bootstrap-modal";
import { EventService } from "../event.service";

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventDetails: EventDetails;
  error: any;

  private selectedPlatoon: Platoon;

  group: ParticipantGroup = new ParticipantGroup();

  @ViewChild(GroupModalComponent)
  modal: GroupModalComponent;

  constructor(private route: ActivatedRoute,
    private eventDetailsService: EventDetailsService, private eventService: EventService) {
  }
  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.eventDetailsService.getEventDetails(+params["id"]))
      .subscribe((eventDetails: EventDetails) => this.eventDetails = eventDetails, error => this.error = <any>error);
  }

  onSelectPlatoon(p: Platoon) {
    console.log(p);
    this.selectedPlatoon = p;
  }

  onSelectGroup(g: ParticipantGroup) {
    // TODO: Link to signup form
  }

  onNewGroup() {
    this.group = new ParticipantGroup();
    this.modal.show();
  }

  onSubmit() {
    this.eventService.addGroup(this.group, this.eventDetails.event.id)
      .subscribe((value: Response) => this.modal.hide(), error => this.error = error);
  }
}
