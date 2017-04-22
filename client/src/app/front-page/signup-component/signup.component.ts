import { Component, Input, OnInit } from '@angular/core';

import { SignupData } from "./signupdata.model";
import { SignupService } from "./signup.service";

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponentComponent implements OnInit {
  @Input() signupData: SignupData;
  error: any;
  constructor(private signupService: SignupService) { }
  
  ngOnInit() {
  	this.signupData = new SignupData();
  }

  attemptSignup(): void {
        console.log("Signing up");
        if (this.signupData.allPresent()){
            this.signupService.sendSignupRequest(this.signupData).
            then(response => {
              console.log("Signed up");
              this.signupData = new SignupData();
            }).catch(error => {
              this.error = error
              alert(error._body);
            });
        }
    }

}
