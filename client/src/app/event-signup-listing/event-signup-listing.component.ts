import { Component, OnInit } from '@angular/core';
import { SignupDetails } from "./signup-details";
import { SignupListingService } from "./signup-listing.service";

@Component({
  selector: 'app-event-signup-listing',
  templateUrl: './event-signup-listing.component.html',
  styleUrls: ['./event-signup-listing.component.css']
})
export class EventSignupListingComponent implements OnInit {

  signupDetails: SignupDetails[] = [
    new SignupDetails(1, "TEST EVENT", 1, "TEST GROUP")
  ];

  constructor(private signupListingService: SignupListingService) { }

  ngOnInit() {
    this.signupListingService.getSignupDetails()
      .subscribe(s => this.signupDetails = s,
      error => console.log(error));
  }

}
