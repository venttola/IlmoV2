import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { EventDetailsService } from "../event-details/event-details.service";
import { ParticipantGroupService } from "../event-details/participant-group.service";
import { ParticipantGroup } from "../event-details/participantgroup.model";
import { Observable } from "rxjs/Observable";
import { Product } from "./product";
import { EventSignupService } from "./event-signup.service";
import { Discount } from "./discount";

@Component({
  selector: 'app-event-signup',
  templateUrl: './event-signup.component.html',
  styleUrls: ['./event-signup.component.css']
})
export class EventSignupComponent implements OnInit {

  private participantGroup: ParticipantGroup;

  private products: Product[] = [];

  constructor(private route: ActivatedRoute,
    private eventSignupService: EventSignupService,
    private participantGroupService: ParticipantGroupService,
    private router: Router) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) =>
        this.participantGroupService.getGroup(+params["groupId"])
          .merge(this.eventSignupService.getProducts(+params["groupId"], +params["eventId"])))
      .subscribe((res: any) => {
        console.log(res);
        (res instanceof ParticipantGroup)
          ? this.participantGroup = res
          : this.products = res;
      });
  }

  onSubmit() {
    console.log(this.products);

    let prods = this.products
      .filter((p: Product) => p.selected === true);

    let prodIds = prods.map((p: Product) => {
      let discounts = p.discounts.filter((d: Discount) => d.selected === true);
      
      let discountId: number = discounts && discounts.length > 0 ? discounts[0].id : null;
      console.log("discountId:" + discountId);
      return [p.id, discountId];
    });

    this.eventSignupService.saveSignup(this.participantGroup.id, prodIds).subscribe((res: any) => {
      // TODO: Redirect to "own signups" view
      this.router.navigate(["main"]);
    });
  }
}
