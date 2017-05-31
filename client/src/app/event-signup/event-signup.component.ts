import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { EventDetailsService } from "../event-details/event-details.service";
import { ParticipantGroupService } from "../event-details/participant-group.service";
import { ParticipantGroup } from "../event-details/participantgroup.model";
import { Observable } from "rxjs/Observable";
import { Product } from "./product";
import { EventSignupService } from "./event-signup.service";
import { Discount } from "./discount";

export class SignUpData {
  signedUp: boolean;
  group: ParticipantGroup;
  eventProducts: Product[];

  static fromJSON(json: any): SignUpData {
    let data = Object.create(SignUpData.prototype);
    Object.assign(data, json);
    return data;
  }
}

@Component({
  selector: 'app-event-signup',
  templateUrl: './event-signup.component.html',
  styleUrls: ['./event-signup.component.css']
})
export class EventSignupComponent implements OnInit {

  private participantGroup: ParticipantGroup;

  private products: Product[] = [];

  private signedUp: boolean = false;
  private signupSuccessful: boolean;
  private updateSuccessful: boolean;

  constructor(private route: ActivatedRoute,
    private eventSignupService: EventSignupService,
    private participantGroupService: ParticipantGroupService,
    private router: Router) { }

  ngOnInit() {
    this.signupSuccessful = false;
    this.route.params
    .switchMap((params: Params) => this.eventSignupService.getSignUpData(+params["groupId"], +params["eventId"]))
    .subscribe((data: SignUpData) => {
      this.signedUp = data.signedUp;
      this.participantGroup = data.group;
      this.products = data.eventProducts;
    });
  }

  addSignup() {
    let prods = this.products
    .filter((p: Product) => p.selected === true);

    let prodIds = prods.map((p: Product) => {
      let discounts = p.discounts.filter((d: Discount) => d.selected === true);
      let discountId: number = discounts && discounts.length > 0 ? discounts[0].id : null;

      return [p.id, discountId];
    });

    this.eventSignupService.saveSignup(this.participantGroup.id, prodIds).subscribe((res: any) =>{
        console.log("SignupSuccesfull");
        this.signupSuccessful = true;
    }, err => {

    });
  }
  updateSignup() {
    let prods = this.products
    .filter((p: Product) => p.selected === true);

    let prodIds = prods.map((p: Product) => {
      let discounts = p.discounts.filter((d: Discount) => d.selected === true);
      let discountId: number = discounts && discounts.length > 0 ? discounts[0].id : null;

      return [p.id, discountId];
    });

    this.eventSignupService.saveSignup(this.participantGroup.id, prodIds).subscribe((res: any) =>{
        console.log("SignupSuccesfull");
        this.updateSuccessful = true;
    }, err => {

    });
  }

  isSignedUp() {
    return this.signedUp;
  }

  cancelSignUp() {
    this.eventSignupService.cancelSignup(this.participantGroup.id)
    .subscribe((success: boolean) => this.router.navigate(["signups"]));
  }
}
