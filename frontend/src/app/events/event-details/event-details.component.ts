import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { EventDetailsService } from "./event-details.service";
import { EventDetails } from "./event-details.model";
import { Response } from "@angular/http";

import 'rxjs/add/operator/switchMap';
import { Platoon } from "../shared/platoon.model";
import { ParticipantGroup } from "../shared/participantgroup.model";
import { ModalDirective } from "ng2-bootstrap/modal";
import { GroupModalComponent } from "../../shared/group-modal/group-modal.component";
import { DialogService } from "ng2-bootstrap-modal";
import { EventService } from "../shared/event.service";

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css', '../../styles/common-list.style.css']
})
export class EventDetailsComponent implements OnInit {
  eventDetails: EventDetails;
  error: any;

  groupsByPlatoon: Map<number, ParticipantGroup[]> = new Map<number, ParticipantGroup[]>();
  selectedPlatoon: number;
  showableGroups: ParticipantGroup[];
  group: ParticipantGroup = new ParticipantGroup();

  @ViewChild(GroupModalComponent)
  modal: GroupModalComponent;

  constructor(private route: ActivatedRoute,
              private eventDetailsService: EventDetailsService, 
              private eventService: EventService) {
  }
  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.eventDetailsService.getEventDetails(+params["id"]))
      .subscribe((eventDetails: EventDetails) => {
        this.eventDetails = eventDetails;
        eventDetails.platoonList.map(p => this.groupsByPlatoon.set(p.id, p.participantGroups));
      },
      error => this.error = <any>error);
  }

  onSelectPlatoon(p: Platoon) {
    this.selectedPlatoon = p.id;
    this.showableGroups = this.groupsByPlatoon.get(p.id);
  }

  onNewGroup(p: Platoon) {
    this.selectedPlatoon = p.id;
    this.group = new ParticipantGroup();
    this.modal.show();
  }

  onSubmit() {
    this.group.platoonId = this.selectedPlatoon;

    this.eventService.createGroup(this.group, this.eventDetails.event.id)
      .subscribe((group: ParticipantGroup) => {
        console.log(group);

        this.groupsByPlatoon.get(this.selectedPlatoon).push(group);
        this.showableGroups = this.groupsByPlatoon.get(this.selectedPlatoon);
        this.modal.hide();
      }, 
      error => this.error = error);
  }
}
